# Protección de la rama `main`

Configuración recomendada (solo owner: **@JuanRomerWRST**).

## Opción A — UI de GitHub

1. Repo → **Settings** → **Rules** → **Rulesets** → **New branch ruleset**
2. Target: `main`
3. Activar:
   - Require a pull request before merging
   - Require review from Code Owners
   - Restrict deletions
   - Block force pushes
4. Restrict who can bypass / merge: solo `JuanRomerWRST`

## Opción B — GitHub CLI

Con [GitHub CLI](https://cli.github.com/) autenticado como owner:

```bash
gh api repos/JuanRomerWRST/Landing-back/rulesets \
  --method POST \
  --input - <<'EOF'
{
  "name": "Protect main — solo owner merge",
  "target": "branch",
  "enforcement": "active",
  "conditions": {
    "ref_name": {
      "include": ["refs/heads/main"],
      "exclude": []
    }
  },
  "rules": [
    { "type": "deletion" },
    { "type": "non_fast_forward" },
    {
      "type": "pull_request",
      "parameters": {
        "required_approving_review_count": 1,
        "dismiss_stale_reviews_on_push": true,
        "require_code_owner_review": true,
        "require_last_push_approval": false,
        "required_review_thread_resolution": true
      }
    }
  ],
  "bypass_actors": [
    {
      "actor_id": 1,
      "actor_type": "OrganizationAdmin",
      "bypass_mode": "always"
    }
  ]
}
EOF
```

> Ajusta `bypass_actors` en la UI para que **solo** tu usuario (`JuanRomerWRST`) pueda hacer merge / bypass. Los IDs de actor dependen de la cuenta; lo más fiable es configurarlo en la UI tras crear el ruleset.
