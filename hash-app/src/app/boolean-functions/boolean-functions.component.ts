import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

// Interface para representar uma linha da tabela-verdade
interface TruthTableRow {
  A: number;
  result: number;
  B?: number; // B é opcional
}

// Interface para representar uma tabela-verdade
interface TruthTable {
  operation: string;
  table: TruthTableRow[];
}

@Component({
  selector: 'app-boolean-functions',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './boolean-functions.component.html',
  styleUrls: ['./boolean-functions.component.css']
})
export class BooleanFunctionsComponent {
  // Propriedades para armazenar as explicações das funções booleanas do MD5
  md5Functions = [
    {
      name: 'F',
      formula: 'F(B, C, D) = (B AND C) OR (NOT B AND D)',
      description: 'A função F realiza uma operação condicional: se B for verdadeiro, o resultado é C; caso contrário, o resultado é D. Essa função é usada na primeira rodada do MD5.'
    },
    {
      name: 'G',
      formula: 'G(B, C, D) = (B AND D) OR (C AND NOT D)',
      description: 'A função G realiza outra operação condicional: se D for verdadeiro, o resultado é B; caso contrário, o resultado é C. Ela é usada na segunda rodada do MD5.'
    },
    {
      name: 'H',
      formula: 'H(B, C, D) = B XOR C XOR D',
      description: 'A função H realiza uma operação XOR entre B, C e D. O resultado é 1 se o número de entradas verdadeiras for ímpar. Essa função é usada na terceira rodada do MD5.'
    },
    {
      name: 'I',
      formula: 'I(B, C, D) = C XOR (B OR NOT D)',
      description: 'A função I realiza uma operação XOR entre C e o resultado de (B OR NOT D). Ela é usada na quarta rodada do MD5.'
    }
  ];

  // Propriedades para armazenar as explicações das funções booleanas do SHA-2
  sha2Functions = [
    {
      name: 'Ch',
      formula: 'Ch(E, F, G) = (E AND F) XOR (NOT E AND G)',
      description: 'A função Ch (Choose) seleciona bits de F ou G dependendo do valor de E. Se o bit de E for 1, o bit correspondente de F é escolhido; caso contrário, o bit de G é escolhido.'
    },
    {
      name: 'Maj',
      formula: 'Maj(A, B, C) = (A AND B) XOR (A AND C) XOR (B AND C)',
      description: 'A função Maj (Majority) retorna o valor majoritário entre A, B e C. Se a maioria dos bits for 1, o resultado é 1; caso contrário, o resultado é 0.'
    },
    {
      name: 'Σ0',
      formula: 'Σ0(A) = (A ROTR 2) XOR (A ROTR 13) XOR (A ROTR 22)',
      description: 'A função Σ0 (Sigma 0) realiza rotações à direita (ROTR) nos bits de A por 2, 13 e 22 posições e aplica uma operação XOR aos resultados.',
      note: 'ROTR (Rotação à Direita): Desloca os bits para a direita, reinserindo-os no lado oposto. Isso garante uma mistura cíclica dos bits.'
    },
    {
      name: 'Σ1',
      formula: 'Σ1(E) = (E ROTR 6) XOR (E ROTR 11) XOR (E ROTR 25)',
      description: 'A função Σ1 (Sigma 1) realiza rotações à direita (ROTR) nos bits de E por 6, 11 e 25 posições e aplica uma operação XOR aos resultados.',
      note: 'ROTR (Rotação à Direita): Desloca os bits para a direita, reinserindo-os no lado oposto. Isso garante uma mistura cíclica dos bits.'
    }
  ];

  // Tabelas-verdade para operações lógicas básicas
  truthTables: TruthTable[] = [
    {
      operation: 'AND',
      table: [
        { A: 0, B: 0, result: 0 },
        { A: 0, B: 1, result: 0 },
        { A: 1, B: 0, result: 0 },
        { A: 1, B: 1, result: 1 }
      ]
    },
    {
      operation: 'OR',
      table: [
        { A: 0, B: 0, result: 0 },
        { A: 0, B: 1, result: 1 },
        { A: 1, B: 0, result: 1 },
        { A: 1, B: 1, result: 1 }
      ]
    },
    {
      operation: 'XOR',
      table: [
        { A: 0, B: 0, result: 0 },
        { A: 0, B: 1, result: 1 },
        { A: 1, B: 0, result: 1 },
        { A: 1, B: 1, result: 0 }
      ]
    },
    {
      operation: 'NOT',
      table: [
        { A: 0, result: 1 },
        { A: 1, result: 0 }
      ]
    }
  ];
}