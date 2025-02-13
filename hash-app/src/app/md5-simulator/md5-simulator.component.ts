import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import SparkMD5 from 'spark-md5';

@Component({
  selector: 'app-md5-simulator',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './md5-simulator.component.html',
  styleUrls: ['./md5-simulator.component.css']
})
export class Md5Simulator {
  inputText: string = '';
  steps: { title: string; content: string[] }[] = [];
  hashFinal: string = '';

  async simulateMD5() {
    this.steps = []; // Limpa os passos anteriores
    this.hashFinal = ''; // Limpa o hash final
    if (this.inputText.length === 0) {
      this.steps.push({
        title: "Erro",
        content: ["Por favor, insira um texto para simular o MD5."]
      });
      return;
    }

    // Passo 1: Converta o texto para binário (8 bits)
    const binaryText = this.textToBinary(this.inputText).slice(0, 8); // Usar apenas 8 bits
    const blockValue = parseInt(binaryText, 2); // Valor decimal do bloco de 8 bits
    this.steps.push({
      title: "Passo 1: Texto em binário (8 bits)",
      content: [`Texto em binário (8 bits): ${binaryText}`]
    });

    // Passo 2: Defina as constantes e variáveis iniciais
    let A = 0x67; // Valor inicial de A (8 bits)
    let B = 0xEF; // Valor inicial de B (8 bits)
    let C = 0x98; // Valor inicial de C (8 bits)
    let D = 0x10; // Valor inicial de D (8 bits)
    this.steps.push({
      title: "Passo 2: Valores iniciais (em binário)",
      content: [
        `A = ${this.toBinary(A, 8)}`,
        `B = ${this.toBinary(B, 8)}`,
        `C = ${this.toBinary(C, 8)}`,
        `D = ${this.toBinary(D, 8)}`
      ]
    });

    // Calcular o hash MD5 real
    const realMD5Hash = await this.calculateRealMD5(this.inputText);

    // Aviso sobre a diferença entre as rodadas e o hash real
    this.steps.push({
      title: "Aviso Importante",
      content: [
        "A Rodada 1 é uma versão simplificada usando apenas 8 bits para facilitar o entendimento.",
        "A partir da Rodada 2, o algoritmo segue a implementação real com 32 bits.",
        `O hash MD5 real do texto "${this.inputText}" seria: ${realMD5Hash}`
      ]
    });

    // Rodada 1: 8 bits (fins didáticos)
    for (let i = 0; i < 4; i++) {
      const targetVariable = ['A', 'B', 'C', 'D'][i % 4]; // Variável alvo (A, B, C ou D)
      const functionParams = this.getFunctionParams(targetVariable); // Parâmetros da função booleana

      // Mapear os nomes das variáveis para seus valores atuais
      const variableMap: { [key: string]: number } = { A, B, C, D };
      const F = this.F(
        variableMap[functionParams[0]],
        variableMap[functionParams[1]],
        variableMap[functionParams[2]]
      );

      const constant = this.getConstant(i, 1); // Constante da operação (8 bits)
      const shift = this.getShift(i, 1); // Deslocamento da operação
      const temp = (A + F + constant + blockValue) & 0xFF; // Limitar a 8 bits
      const rotatedTemp = this.leftRotate(temp, shift, 8); // Rotação de 8 bits
      const newB = (B + rotatedTemp) & 0xFF; // Limitar a 8 bits

      this.steps.push({
        title: `Rodada 1 - Operação ${i + 1}: Calculando ${targetVariable}`,
        content: [
          `${targetVariable} = ${targetVariable} + F(${functionParams.join(', ')}) + Constante + Bloco`,
          `F(${functionParams.join(', ')}) = (${this.toBinary(variableMap[functionParams[0]], 8)} & ${this.toBinary(variableMap[functionParams[1]], 8)}) | (~${this.toBinary(variableMap[functionParams[0]], 8)} & ${this.toBinary(variableMap[functionParams[2]], 8)})`,
          `F(${functionParams.join(', ')}) = ${this.toBinary(F, 8)}`,
          `Constante = ${this.toBinary(constant, 8)}`,
          `Bloco (8 bits) = ${binaryText}`,
          `Temp = ${targetVariable} + F(${functionParams.join(', ')}) + Constante + Bloco`,
          `       = ${this.toBinary(A, 8)} + ${this.toBinary(F, 8)} + ${this.toBinary(constant, 8)} + ${binaryText}`,
          `       = ${this.toBinary(temp, 8)}`,
          `Temp rotacionado (<< ${shift}) = ${this.toBinary(rotatedTemp, 8)}`,
          `Novo ${targetVariable} = ${targetVariable} + Temp rotacionado`,
          `         = ${this.toBinary(B, 8)} + ${this.toBinary(rotatedTemp, 8)}`,
          `         = ${this.toBinary(newB, 8)}`,
          `Registradores atualizados (em binário):`,
          `  A = ${this.toBinary(A, 8)}`,
          `  B = ${this.toBinary(B, 8)}`,
          `  C = ${this.toBinary(C, 8)}`,
          `  D = ${this.toBinary(D, 8)}`
        ]
      });

      // Atualizar os registradores
      const oldA = A;
      A = D;
      D = C;
      C = B;
      B = newB;
    }

    // Rodadas 2, 3 e 4: 32 bits (algoritmo real)
    for (let round = 2; round <= 4; round++) {
      for (let i = 0; i < 4; i++) {
        const targetVariable = ['A', 'B', 'C', 'D'][i % 4]; // Variável alvo (A, B, C ou D)
        const functionParams = this.getFunctionParams(targetVariable); // Parâmetros da função booleana

        // Mapear os nomes das variáveis para seus valores atuais
        const variableMap: { [key: string]: number } = { A, B, C, D };
        const F = this.getRoundFunction(
          round,
          variableMap[functionParams[0]],
          variableMap[functionParams[1]],
          variableMap[functionParams[2]]
        );

        const constant = this.getConstant(i, round); // Constante da operação
        const shift = this.getShift(i, round); // Deslocamento da operação
        const temp = (A + F + constant) >>> 0; // Garantir 32 bits
        const rotatedTemp = this.leftRotate(temp, shift, 32); // Rotação de 32 bits
        const newB = (B + rotatedTemp) >>> 0; // Garantir 32 bits

        this.steps.push({
          title: `Rodada ${round} - Operação ${i + 1}: Calculando ${targetVariable}`,
          content: [
            `${targetVariable} = ${targetVariable} + ${this.getRoundFunctionName(round)}(${functionParams.join(', ')}) + Constante`,
            `${this.getRoundFunctionName(round)}(${functionParams.join(', ')}) = ${this.toHex(F)}`,
            `Constante = ${this.toHex(constant)}`,
            `Temp = ${targetVariable} + ${this.getRoundFunctionName(round)}(${functionParams.join(', ')}) + Constante`,
            `       = ${this.toHex(A)} + ${this.toHex(F)} + ${this.toHex(constant)}`,
            `       = ${this.toHex(temp)}`,
            `Temp rotacionado (<< ${shift}) = ${this.toHex(rotatedTemp)}`,
            `Novo ${targetVariable} = ${targetVariable} + Temp rotacionado`,
            `         = ${this.toHex(B)} + ${this.toHex(rotatedTemp)}`,
            `         = ${this.toHex(newB)}`,
            `Registradores atualizados (em hexadecimal):`,
            `  A = ${this.toHex(A)}`,
            `  B = ${this.toHex(B)}`,
            `  C = ${this.toHex(C)}`,
            `  D = ${this.toHex(D)}`
          ]
        });

        // Atualizar os registradores
        const oldA = A;
        A = D;
        D = C;
        C = B;
        B = newB;
      }
    }

    // Passo 3: Calcular o hash final (soma dos valores iniciais com os finais)
    const A0 = 0x67452301;
    const B0 = 0xEFCDAB89;
    const C0 = 0x98BADCFE;
    const D0 = 0x10325476;
    const A_final = (A0 + A) >>> 0;
    const B_final = (B0 + B) >>> 0;
    const C_final = (C0 + C) >>> 0;
    const D_final = (D0 + D) >>> 0;
    this.hashFinal = this.toHex(A_final) + this.toHex(B_final) + this.toHex(C_final) + this.toHex(D_final);

    this.steps.push({
      title: "Hash Final",
      content: [
        `A_final = A0 + A = ${this.toHex(A0)} + ${this.toHex(A)} = ${this.toHex(A_final)}`,
        `B_final = B0 + B = ${this.toHex(B0)} + ${this.toHex(B)} = ${this.toHex(B_final)}`,
        `C_final = C0 + C = ${this.toHex(C0)} + ${this.toHex(C)} = ${this.toHex(C_final)}`,
        `D_final = D0 + D = ${this.toHex(D0)} + ${this.toHex(D)} = ${this.toHex(D_final)}`,
        `Hash Final: ${this.hashFinal}`
      ]
    });
  }

  // Função para calcular o hash MD5 real usando SparkMD5
  private calculateRealMD5(text: string): string {
    return SparkMD5.hash(text);
  }
  // Funções lógicas das rodadas
  private F(X: number, Y: number, Z: number): number {
    return (X & Y) | (~X & Z);
  }

  private G(X: number, Y: number, Z: number): number {
    return (X & Z) | (Y & ~Z);
  }

  private H(X: number, Y: number, Z: number): number {
    return X ^ Y ^ Z;
  }

  private I(X: number, Y: number, Z: number): number {
    return Y ^ (X | ~Z);
  }

  // Retorna a função lógica da rodada
  private getRoundFunction(round: number, X: number, Y: number, Z: number): number {
    switch (round) {
      case 1: return this.F(X, Y, Z);
      case 2: return this.G(X, Y, Z);
      case 3: return this.H(X, Y, Z);
      case 4: return this.I(X, Y, Z);
      default: return 0;
    }
  }

  // Retorna o nome da função lógica da rodada
  private getRoundFunctionName(round: number): string {
    switch (round) {
      case 1: return 'F';
      case 2: return 'G';
      case 3: return 'H';
      case 4: return 'I';
      default: return '';
    }
  }

  // Função de rotação à esquerda
  private leftRotate(value: number, shift: number, bits: number): number {
    if (bits === 8) {
      return ((value << shift) | (value >>> (8 - shift))) & 0xFF;
    } else {
      return ((value << shift) | (value >>> (32 - shift))) >>> 0;
    }
  }

  // Converta o texto para binário (8 bits)
  private textToBinary(text: string): string {
    return text.split('').map(char => {
      return char.charCodeAt(0).toString(2).padStart(8, '0');
    }).join('');
  }

  // Retorna a constante da operação
  private getConstant(operation: number, round: number): number {
    const constants = [
      [0xD7, 0xE8, 0x24, 0xC1], // Rodada 1 (8 bits)
      [0xF57C0FAF, 0x4787C62A, 0xA8304613, 0xFD469501], // Rodada 2
      [0x698098D8, 0x8B44F7AF, 0xFFFF5BB1, 0x895CD7BE], // Rodada 3
      [0x6B901122, 0xFD987193, 0xA679438E, 0x49B40821]  // Rodada 4
    ];
    return constants[round - 1][operation];
  }

  // Retorna o deslocamento da operação
  private getShift(operation: number, round: number): number {
    const shifts = [
      [7, 12, 17, 22], // Rodada 1 (8 bits)
      [5, 9, 14, 20],   // Rodada 2
      [4, 11, 16, 23],  // Rodada 3
      [6, 10, 15, 21]   // Rodada 4
    ];
    return shifts[round - 1][operation];
  }

  // Converte um número para binário com padding
  private toBinary(value: number, bits: number): string {
    return (value >>> 0).toString(2).padStart(bits, '0');
  }

  // Converte um número para hexadecimal
  private toHex(value: number): string {
    return (value >>> 0).toString(16).padStart(8, '0');
  }

  // Obtém os parâmetros da função booleana
  private getFunctionParams(targetVariable: string): string[] {
    switch (targetVariable) {
      case 'A': return ['B', 'C', 'D'];
      case 'B': return ['A', 'C', 'D'];
      case 'C': return ['A', 'B', 'D'];
      case 'D': return ['A', 'B', 'C'];
      default: return [];
    }
  }
}