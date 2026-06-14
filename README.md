# CompareNotes

Sistema Web de Apoio à Decisão para Comparação de Notebooks desenvolvido como Trabalho de Conclusão de Curso (TCC) do curso de Análise e Desenvolvimento de Sistemas do Instituto Federal de Sergipe (IFS).

## Sobre o Projeto

O CompareNotes foi desenvolvido com o objetivo de auxiliar usuários no processo de escolha e comparação de notebooks, apresentando informações técnicas de forma organizada, padronizada e visual.

O sistema permite comparar diferentes modelos lado a lado, facilitando a análise de características como:

* Processador
* Placa de vídeo
* Memória RAM
* Armazenamento
* Tela
* Conectividade
* Peso
* Dimensões
* Bateria
* Fonte
* Teclado
* Webcam
* Construção

## Objetivos

* Reduzir a sobrecarga de informações durante a escolha de notebooks.
* Facilitar a comparação entre modelos concorrentes.
* Apresentar dados técnicos de forma clara e padronizada.
* Aplicar conceitos de Sistemas de Apoio à Decisão (SAD) em ambiente web.

## Tecnologias Utilizadas

### Front-end

* Next.js
* React
* TypeScript
* Tailwind CSS
* shadcn/ui

### Visualização 3D

* React Three Fiber
* Three.js

### Back-end

* Next.js API Routes

### Banco de Dados

* PostgreSQL
* Supabase

### Hospedagem

* Vercel

## Banco de Dados

O sistema utiliza PostgreSQL hospedado no Supabase.

Principais entidades:

* notebook
* especificacao
* tela
* dimensao
* conectividade
* teclado
* webcam
* bateria
* fonte
* construcao

## Funcionalidades

* Cadastro de notebooks no banco de dados
* Consulta dinâmica via PostgreSQL
* Comparação entre modelos
* Visualização de dimensões físicas
* Exibição padronizada de especificações técnicas
* Interface responsiva

## Autor

Wagner Guilherme Alves da Silva

Instituto Federal de Sergipe (IFS)

Curso: Análise e Desenvolvimento de Sistemas

## Licença

Projeto desenvolvido para fins acadêmicos como Trabalho de Conclusão de Curso.
