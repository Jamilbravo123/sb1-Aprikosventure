# CLAUDE.md

## Prosjektminne

Minnet for dette prosjektet ligger i `memory/` i dette repoet — ikke i det globale
`~/.claude`-minnet. Det følger prosjektet via git, uavhengig av maskin, brukernavn og lokal sti.

- **Ved oppstart:** les `memory/MEMORY.md` og de notatene den peker på.
- **Nye prosjektnotater skrives hit**, ikke til det globale minnet. Oppdater `memory/MEMORY.md`
  med én pekerlinje per nytt notat.
- Det globale minnet er kun for personlige preferanser og generelle arbeidsregler på tvers av prosjekter.
- **Secret-skann før hver push.** Aldri nøkkelverdier, passord eller personopplysninger i minnefiler.
