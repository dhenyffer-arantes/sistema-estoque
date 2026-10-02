# Sistema de Gerenciamento de Estoque e Vendas

## Escopo

Este projeto é um sistema de gerenciamento de estoque e vendas voltado para
pequenos comércios de variedades. Ele resolve um problema real observado em
uma loja onde todo o controle era feito manualmente: não havia registro de
quantas peças existiam em estoque, quantas foram vendidas de cada produto,
nem qual vendedora realizou cada venda — informação importante, já que as
vendedoras recebem comissão sobre o valor vendido.

O sistema permite:
- Cadastro de produtos por código de barras, com controle de estoque;
- Registro de vendas associadas ao usuário (vendedora) autenticado;
- Consulta de histórico de vendas e cálculo de comissão por vendedora;
- Dois perfis de acesso: **Administrador** (gerencia produtos, usuários e
  relatórios) e **Vendedor** (registra vendas).

## Diagrama de Entidade-Relacionamento (DER)

```mermaid
erDiagram
    USUARIO ||--o{ VENDA : realiza
    VENDA ||--o{ ITEM_VENDA : contem
    PRODUTO ||--o{ ITEM_VENDA : "e vendido em"

    USUARIO {
        int id PK
        string nome
        string email
        string senha
        string role
    }
    PRODUTO {
        int id PK
        string codigoBarras
        string nome
        decimal preco
        int estoque
    }
    VENDA {
        int id PK
        int usuarioId FK
        datetime data
    }
    ITEM_VENDA {
        int id PK
        int vendaId FK
        int produtoId FK
        int quantidade
        decimal precoUnitario
    }
```