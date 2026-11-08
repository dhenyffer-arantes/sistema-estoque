# Sistema de Gerenciamento de Estoque e Vendas

Este projeto foi desenvolvido para atender às necessidades reais de um pequeno comércio de variedades que costumava controlar todo o seu inventário de forma manual. A falta de registros sobre o volume de peças em estoque, o histórico de itens vendidos e a identificação da vendedora responsável por cada operação dificultava a gestão do negócio e o cálculo correto das comissões.

A aplicação resolve esses problemas ao automatizar a baixa de estoque a cada transação, vincular as vendas ao perfil de quem a realizou e permitir o controle de acesso entre administradores e vendedores.

# 🛒 API de Gestão de Estoque e Vendas

API RESTful desenvolvida em Node.js e Express para gerenciamento de estoque, controle de vendas, autenticação por permissões (RBAC) e consulta externa de CEP.

- Links Úteis
* API em Produção (Render):`https://sistema-estoque-api-a52f.onrender.com`
* Repositório GitHub:`[LINK_DO_SEU_REPOSITORIO]`
* Collection de Testes: Disponível no arquivo `./collection.json` na raiz deste repositório.

---

- Modelo de Banco de Dados (DER)

O banco de dados PostgreSQL é composto por 5 tabelas com relacionamentos e regras estritas de integridade referencial:

```mermaid
erDiagram
    users ||--o{ vendas : "realiza"
    users ||--o{ password_resets : "possui"
    vendas ||--|{ item_venda : "contem"
    products ||--o{ item_venda : "pertence"

    users {
        int id PK
        string name
        string email
        string password_hash
        string role
    }

    products {
        int id PK
        string codigo_barras
        string nome
        decimal preco
        int estoque
    }

    vendas {
        int id PK
        int usuario_id FK
        timestamp created_at
    }

    item_venda {
        int id PK
        int venda_id FK
        int produto_id FK
        int quantidade
        decimal preco_unitario
    }

    password_resets {
        int id PK
        int user_id FK
        string token
        timestamp expires_at
    }