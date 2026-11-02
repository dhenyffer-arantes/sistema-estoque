# Sistema de Gerenciamento de Estoque e Vendas

Este projeto foi desenvolvido para atender às necessidades reais de um pequeno comércio de variedades que costumava controlar todo o seu inventário de forma manual. A falta de registros sobre o volume de peças em estoque, o histórico de itens vendidos e a identificação da vendedora responsável por cada operação dificultava a gestão do negócio e o cálculo correto das comissões.

A aplicação resolve esses problemas ao automatizar a baixa de estoque a cada transação, vincular as vendas ao perfil de quem a realizou e permitir o controle de acesso entre administradores e vendedores.

---

## Estrutura de Dados

O diagrama abaixo ilustra a relação entre usuários, vendas efetuadas, itens comercializados e os produtos cadastrados no sistema:

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
        string preco
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