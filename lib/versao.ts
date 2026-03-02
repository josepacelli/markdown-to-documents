/**
 * Configuração de versão da aplicação
 * Lê a versão da variável de ambiente NEXT_PUBLIC_APP_VERSION
 * Sincronizada com package.json
 */

export const VERSAO_APP = process.env.NEXT_PUBLIC_APP_VERSION || '1.0.40';

/**
 * Obtém a versão formatada da aplicação
 * @returns String com a versão formatada (v1.0.0)
 */
export function obterVersaoFormatada(): string {
  return `v${VERSAO_APP}`;
}
