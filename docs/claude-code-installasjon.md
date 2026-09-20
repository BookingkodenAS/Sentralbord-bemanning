# Claude Code – native installasjon (Windows)

Notater for å komme i gang med Claude Code CLI lokalt, f.eks. når du har klonet
Sentralbord-bemanning-reposet og vil jobbe fra egen maskin.

## Merk

- Ingen forutsetninger for den native installasjonen, og du trenger ikke
  admin-rettigheter.
- Valgfritt: installer [Git for Windows](https://git-scm.com/download/win) for
  Bash-støtte — ellers bruker Claude Code PowerShell.
- Det finnes også en desktop-app (GUI) på https://claude.com/download, som
  alternativ til CLI-en.

## Kom i gang

1. Åpne PowerShell i prosjektmappen din (f.eks. der du har klonet
   Sentralbord-bemanning-reposet lokalt).
2. Kjør `claude` for å starte en økt.
3. Nettleseren åpnes for innlogging (krever Pro/Max/Team/Enterprise-konto).
4. Verifiser installasjon med `claude --version`.

## Oppdatering

Native installasjon oppdaterer seg selv automatisk. WinGet- og
npm-installasjoner må oppdateres manuelt.
