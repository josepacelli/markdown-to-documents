import { obterVersaoFormatada, VERSAO_APP } from '@/lib/versao';

describe('lib/versao.ts', () => {
  describe('VERSAO_APP', () => {
    it('deve estar definida', () => {
      expect(VERSAO_APP).toBeDefined();
    });

    it('deve ser uma string', () => {
      expect(typeof VERSAO_APP).toBe('string');
    });

    it('deve seguir padrão semântico (major.minor.patch)', () => {
      const regex = /^\d+\.\d+\.\d+$/;
      expect(VERSAO_APP).toMatch(regex);
    });

    it('deve ter valor padrão 1.0.40', () => {
      // Se NEXT_PUBLIC_APP_VERSION não está definida, deve ser 1.0.40
      if (!process.env.NEXT_PUBLIC_APP_VERSION) {
        expect(VERSAO_APP).toBe('1.0.40');
      }
    });
  });

  describe('obterVersaoFormatada()', () => {
    it('deve retornar versão com prefixo "v"', () => {
      const versao = obterVersaoFormatada();
      expect(versao).toMatch(/^v\d+\.\d+\.\d+$/);
    });

    it('deve conter a versão correta', () => {
      const versao = obterVersaoFormatada();
      expect(versao).toBe(`v${VERSAO_APP}`);
    });

    it('deve ser uma string', () => {
      const versao = obterVersaoFormatada();
      expect(typeof versao).toBe('string');
    });

    it('deve não estar vazia', () => {
      const versao = obterVersaoFormatada();
      expect(versao.length).toBeGreaterThan(0);
    });

    it('deve começar com "v"', () => {
      const versao = obterVersaoFormatada();
      expect(versao.startsWith('v')).toBe(true);
    });
  });
});
