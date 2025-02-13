import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-sha2-simulator',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './sha2-simulator.component.html',
  styleUrls: ['./sha2-simulator.component.css']
})
export class Sha2SimulatorComponent {
  inputText: string = '';
  stepByStep: { title: string; content: string[] }[] = [];
  H = [0x67, 0xEF, 0x98, 0x10, 0x32, 0xAB, 0xCD, 0xEF]; // Valores iniciais (8 bits)
  K = [
    0x42, 0x71, 0xB5, 0xE9, // Constantes das rodadas (8 bits)
    0x39, 0x59, 0x92, 0xAB
  ];
  W: number[] = []; // Cronograma de mensagens
  hashFinal: string = ''; // Hash final calculado
  realHash: string = ''; // Hash real gerado pelo algoritmo SHA-2

  async processInput() {
    if (!this.inputText) return;
    this.stepByStep = []; // Limpa os passos anteriores
    this.hashFinal = ''; // Limpa o hash final
    this.realHash = ''; // Limpa o hash real

    // Passo inicial: Texto de entrada
    this.stepByStep.push({
      title: "Texto de Entrada",
      content: [`"${this.inputText}"`]
    });

    // Converte o texto para binário
    let binaryText = this.textToBinary(this.inputText);
    binaryText.forEach((b, i) => {
      this.stepByStep.push({
        title: `Caractere "${this.inputText[i]}"`,
        content: [`Binário: ${b}`]
      });
    });

    // Gera o cronograma de mensagens (W)
    this.W = this.generateMessageSchedule(binaryText);
    this.W.forEach((w, i) => {
      this.stepByStep.push({
        title: `Cronograma de Mensagens - W[${i}]`,
        content: [`Valor: ${w.toString(16).padStart(2, '0')}`]
      });
    });

    // Calcula o hash real usando crypto.subtle
    this.realHash = await this.calculateRealSHA2Hash(this.inputText);

    // Aviso sobre a diferença entre as rodadas
    this.stepByStep.push({
      title: "Aviso Importante",
      content: [
        "As rodadas de 1 a 4 são uma versão simplificada usando apenas 8 bits para facilitar o entendimento.",
        "As rodadas de 5 a 8 seguem a implementação real com 32 bits.",
        `O hash real gerado pelo algoritmo SHA-2 para o texto "${this.inputText}" é: ${this.realHash}`
      ]
    });

    // Simula as rodadas do SHA-2
    this.simulateSHA2Rounds();
  }

  async calculateRealSHA2Hash(text: string): Promise<string> {
    const encoder = new TextEncoder();
    const data = encoder.encode(text);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(byte => byte.toString(16).padStart(2, '0')).join('');
  }

  textToBinary(text: string): string[] {
    return text.split('').map(char => char.charCodeAt(0).toString(2).padStart(8, '0'));
  }

  generateMessageSchedule(binaryText: string[]): number[] {
    return binaryText.slice(0, 8).map(b => parseInt(b, 2)); // Extrai até 8 bytes (8 bits)
  }

  rotateRight(value: number, shift: number, bits: number): number {
    return ((value >>> shift) | (value << (bits - shift))) & ((1 << bits) - 1);
  }

  Σ0_8(value: number): number {
    return (
      this.rotateRight(value, 2, 8) ^
      this.rotateRight(value, 13, 8) ^
      this.rotateRight(value, 22, 8)
    );
  }

  Σ1_8(value: number): number {
    return (
      this.rotateRight(value, 6, 8) ^
      this.rotateRight(value, 11, 8) ^
      this.rotateRight(value, 25, 8)
    );
  }

  Ch_8(x: number, y: number, z: number): number {
    return (x & y) ^ (~x & z);
  }

  Maj_8(x: number, y: number, z: number): number {
    return (x & y) ^ (x & z) ^ (y & z);
  }

  Σ0_32(value: number): number {
    return (
      this.rotateRight(value, 2, 32) ^
      this.rotateRight(value, 13, 32) ^
      this.rotateRight(value, 22, 32)
    );
  }

  Σ1_32(value: number): number {
    return (
      this.rotateRight(value, 6, 32) ^
      this.rotateRight(value, 11, 32) ^
      this.rotateRight(value, 25, 32)
    );
  }

  Ch_32(x: number, y: number, z: number): number {
    return (x & y) ^ (~x & z);
  }

  Maj_32(x: number, y: number, z: number): number {
    return (x & y) ^ (x & z) ^ (y & z);
  }

  simulateSHA2Rounds() {
    let [a, b, c, d, e, f, g, h] = this.H;

    // Rodadas 1 a 4 (8 bits)
    for (let i = 0; i < 4; i++) {
      this.stepByStep.push({
        title: `Rodada ${i + 1} (8 bits)`,
        content: []
      });

      let Σ1_e = this.Σ1_8(e);
      let Ch_efg = this.Ch_8(e, f, g);
      let Σ0_a = this.Σ0_8(a);
      let Maj_abc = this.Maj_8(a, b, c);
      let T1 = (h + Σ1_e + Ch_efg + this.K[i] + this.W[i]) & 0xFF;
      let T2 = (Σ0_a + Maj_abc) & 0xFF;

      const currentStep = this.stepByStep[this.stepByStep.length - 1];
      currentStep.content.push(
        `**Cálculo das funções lógicas:**`,
        `Σ1(e) = ROTR^6(${e.toString(2)}) ⊕ ROTR^11(${e.toString(2)}) ⊕ ROTR^25(${e.toString(2)}) = ${Σ1_e.toString(2)}`,
        `Ch(e, f, g) = (${e.toString(2)} & ${f.toString(2)}) ⊕ ((¬${e.toString(2)}) & ${g.toString(2)}) = ${Ch_efg.toString(2)}`,
        `Σ0(a) = ROTR^2(${a.toString(2)}) ⊕ ROTR^13(${a.toString(2)}) ⊕ ROTR^22(${a.toString(2)}) = ${Σ0_a.toString(2)}`,
        `Maj(a, b, c) = (${a.toString(2)} & ${b.toString(2)}) ⊕ (${a.toString(2)} & ${c.toString(2)}) ⊕ (${b.toString(2)} & ${c.toString(2)}) = ${Maj_abc.toString(2)}`,
        `**Cálculo dos valores temporários:**`,
        `T1 = h + Σ1(e) + Ch(e, f, g) + K[${i}] + W[${i}]`,
        `       = ${h.toString(2)} + ${Σ1_e.toString(2)} + ${Ch_efg.toString(2)} + ${this.K[i].toString(2)} + ${this.W[i].toString(2)}`,
        `       = ${T1.toString(2)}`,
        `T2 = Σ0(a) + Maj(a, b, c)`,
        `       = ${Σ0_a.toString(2)} + ${Maj_abc.toString(2)}`,
        `       = ${T2.toString(2)}`
      );

      // Atualiza as variáveis
      let new_h = g;
      let new_g = f;
      let new_f = e;
      let new_e = (d + T1) & 0xFF;
      let new_d = c;
      let new_c = b;
      let new_b = a;
      let new_a = (T1 + T2) & 0xFF;

      currentStep.content.push(
        `**Atualização das variáveis ao final da rodada ${i + 1}:**`,
        `h = ${new_h.toString(2).padStart(8, '0')}`,
        `g = ${new_g.toString(2).padStart(8, '0')}`,
        `f = ${new_f.toString(2).padStart(8, '0')}`,
        `e = ${d.toString(2).padStart(8, '0')} + ${T1.toString(2).padStart(8, '0')}`,
        `d = ${new_d.toString(2).padStart(8, '0')}`,
        `c = ${new_c.toString(2).padStart(8, '0')}`,
        `b = ${new_b.toString(2).padStart(8, '0')}`,
        `a = ${T1.toString(2).padStart(8, '0')} + ${T2.toString(2).padStart(8, '0')}`
      );

      // Atualiza os registradores
      a = new_a;
      b = new_b;
      c = new_c;
      d = new_d;
      e = new_e;
      f = new_f;
      g = new_g;
      h = new_h;
    }

    // Rodadas 5 a 8 (32 bits)
    for (let i = 4; i < 8; i++) {
      this.stepByStep.push({
        title: `Rodada ${i + 1} (32 bits)`,
        content: []
      });

      let Σ1_e = this.Σ1_32(e);
      let Ch_efg = this.Ch_32(e, f, g);
      let Σ0_a = this.Σ0_32(a);
      let Maj_abc = this.Maj_32(a, b, c);
      let T1 = (h + Σ1_e + Ch_efg + this.K[i] + this.W[i]) >>> 0;
      let T2 = (Σ0_a + Maj_abc) >>> 0;

      const currentStep = this.stepByStep[this.stepByStep.length - 1];
      currentStep.content.push(
        `**Cálculo das funções lógicas:**`,
        `Σ1(e) = ROTR^6(${e.toString(16)}) ⊕ ROTR^11(${e.toString(16)}) ⊕ ROTR^25(${e.toString(16)}) = ${Σ1_e.toString(16)}`,
        `Ch(e, f, g) = (${e.toString(16)} & ${f.toString(16)}) ⊕ ((¬${e.toString(16)}) & ${g.toString(16)}) = ${Ch_efg.toString(16)}`,
        `Σ0(a) = ROTR^2(${a.toString(16)}) ⊕ ROTR^13(${a.toString(16)}) ⊕ ROTR^22(${a.toString(16)}) = ${Σ0_a.toString(16)}`,
        `Maj(a, b, c) = (${a.toString(16)} & ${b.toString(16)}) ⊕ (${a.toString(16)} & ${c.toString(16)}) ⊕ (${b.toString(16)} & ${c.toString(16)}) = ${Maj_abc.toString(16)}`,
        `**Cálculo dos valores temporários:**`,
        `T1 = h + Σ1(e) + Ch(e, f, g) + K[${i}] + W[${i}]`,
        `       = ${h.toString(16)} + ${Σ1_e.toString(16)} + ${Ch_efg.toString(16)} + ${this.K[i].toString(16)} + ${this.W[i].toString(16)}`,
        `       = ${T1.toString(16)}`,
        `T2 = Σ0(a) + Maj(a, b, c)`,
        `       = ${Σ0_a.toString(16)} + ${Maj_abc.toString(16)}`,
        `       = ${T2.toString(16)}`
      );

      // Atualiza as variáveis
      let new_h = g;
      let new_g = f;
      let new_f = e;
      let new_e = (d + T1) >>> 0;
      let new_d = c;
      let new_c = b;
      let new_b = a;
      let new_a = (T1 + T2) >>> 0;

      currentStep.content.push(
        `**Atualização das variáveis ao final da rodada ${i + 1}:**`,
        `h = ${new_h.toString(16).padStart(8, '0')}`,
        `g = ${new_g.toString(16).padStart(8, '0')}`,
        `f = ${new_f.toString(16).padStart(8, '0')}`,
        `e = ${d.toString(16).padStart(8, '0')} + ${T1.toString(16).padStart(8, '0')}`,
        `d = ${new_d.toString(16).padStart(8, '0')}`,
        `c = ${new_c.toString(16).padStart(8, '0')}`,
        `b = ${new_b.toString(16).padStart(8, '0')}`,
        `a = ${T1.toString(16).padStart(8, '0')} + ${T2.toString(16).padStart(8, '0')}`
      );

      // Atualiza os registradores
      a = new_a;
      b = new_b;
      c = new_c;
      d = new_d;
      e = new_e;
      f = new_f;
      g = new_g;
      h = new_h;
    }

    // Cálculo do hash final após a rodada 8
    const H0 = [0x67452301, 0xEFCDAB89, 0x98BADCFE, 0x10325476, 0xC3D2E1F0, 0x57A2B3C4, 0xD1E2F3A4, 0xB5C6D7E8]; // Valores iniciais reais
    const finalHashParts = [
      (H0[0] + a) >>> 0,
      (H0[1] + b) >>> 0,
      (H0[2] + c) >>> 0,
      (H0[3] + d) >>> 0,
      (H0[4] + e) >>> 0,
      (H0[5] + f) >>> 0,
      (H0[6] + g) >>> 0,
      (H0[7] + h) >>> 0
    ];

    // Converte os valores finais para hexadecimal
    this.hashFinal = finalHashParts.map(part => part.toString(16).padStart(8, '0')).join('');

    // Adiciona o hash final ao array stepByStep
    this.stepByStep.push({
      title: "Hash Final",
      content: [
        `O hash final gerado pelo simulador é: ${this.hashFinal}`,
        `Este hash foi calculado somando os valores iniciais aos registradores finais e convertendo para hexadecimal.`
      ]
    });
  }
}