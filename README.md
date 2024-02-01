
# DesafioTuntsRock

Criacao de uma aplicacao para alterar a planilha google utilizando a api do google.


## Instalação

Instale o projeto com npm

```bash
  cd DesafioTuntsRock
  npm install
```
    
## Deploy

Para fazer o deploy desse projeto rode

```bash
  npm run start
```

por padrão, a aplicacao será iniciada na porta 3000.
## Documentação da API

#### Reseta os valores da planilha

```http
  GET localhost:3000/reset
```

#### Calcula a situacao dos alunos da planilha e escreve nela

```http
  GET localhost:3000/calcularSituacao
```
