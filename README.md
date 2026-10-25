```markdown
# 💬 WhatsApp - Links Rápidos

Sistema simples para gerar links diretos do WhatsApp com mensagens pré-preenchidas para atendimento técnico.

## 📋 Descrição

Ferramenta web que permite gerar links do WhatsApp para contato com clientes, com mensagens automáticas para **Instalação** e **Reparo**, selecionáveis entre as operadoras **NIO** e **TIM**.

## ✨ Funcionalidades

| Funcionalidade | Descrição |
|---|---|
| 📡 Seleção de Operadora | Escolha entre NIO ou TIM — a mensagem se ajusta automaticamente |
| 📞 Número de Telefone | Campo com validação e formatação automática (código 55) |
| 🔧 Botão Instalação | Envia mensagem padrão de instalação |
| 🔨 Botão Reparo | Envia mensagem padrão de reparo |
| 📱 Abrir WhatsApp | Abre o WhatsApp com a mensagem personalizada do campo |
| 👁️ Pré-visualização | Mostra a mensagem que será enviada em tempo real |

## 🚀 Como Usar

1. **Escolha a operadora** (NIO ou TIM)
2. **Digite o número** do cliente com DDD (ex: `11987654321`)
3. **Clique no botão desejado**:
   - `Instalação` → abre WhatsApp com mensagem de instalação
   - `Reparo` → abre WhatsApp com mensagem de reparo
   - `Abrir WhatsApp` → abre WhatsApp com a mensagem personalizada
4. **Confirme o envio** no WhatsApp que será aberto

> O número recebe automaticamente o código do país (55) se não estiver presente.

## 📝 Mensagens Padrão

### Instalação
> Olá, sou técnico da **[NIO/TIM]** contato referente à instalação. Tem alguém no local para me receber agora? Estou aqui na frente da sua residência.

### Reparo
> Olá, sou técnico da **[NIO/TIM]** contato referente ao reparo. Tem alguém no local para me receber agora? Estou aqui na frente da sua residência.

O nome da operadora é preenchido automaticamente conforme a seleção.

## 🛠️ Como Rodar

### Localmente
Basta abrir o arquivo `index.html` em qualquer navegador moderno:

```bash
# Simplesmente abra o arquivo
# index.html
```

Ou use um servidor local:

```bash
# Python
python -m http.server 8080

# Node.js
npx serve .
```

Acesse: `http://localhost:8080`

### Deploy Gratuito

Plataforma | Como |
|---|---|
| **GitHub Pages** | Suba o `index.html` no repositório e ative Pages |
| **Netlify** | Arraste a pasta no [netlify.com/drop](https://app.netlify.com/drop) |
| **Vercel** | `vercel deploy` no terminal |
| **Glitch** | Crie um projeto e cole o código |

## 🎨 Personalização

### Alterar Mensagens
No arquivo `index.html`, procure a função `getStandardMessage()` no `<script>`:

```javascript
function getStandardMessage(type) {
    const operator = getOperator();
    
    if (type === 'install') {
        return `Olá, sou técnico da ${operator} contato referente à instalação. ...`;
        // ↑ Edite aqui
    } else {
        return `Olá, sou técnico da ${operator} contato referente ao reparo. ...`;
        // ↑ Edite aqui
    }
}
```

### Adicionar Nova Operadora
1. No **HTML**, adicione dentro da `.operator-group`:

```html
<div class="operator-option">
    <input type="radio" name="operator" id="operator-claro" value="Claro">
    <label for="operator-claro" class="operator-label">
        <span class="operator-icon">📳</span>
        Claro
    </label>
</div>
```

2. No **JavaScript**, atualize a função:

```javascript
const radioClaro = document.getElementById('operator-claro');

function getOperator() {
    if (radioNIO.checked) return 'NIO';
    if (radioTIM.checked) return 'TIM';
    if (radioClaro.checked) return 'Claro';
    return 'NIO';
}
```

### Alterar Cores
Procure as variáveis de cor no `<style>`:

```css
/* Verde WhatsApp */
#25d366  → principal
#128c7e  → hover / instalação
#d3332d  → reparo / erro
#f0f2f5  → fundo da página
```

## 📁 Estrutura

```
projeto/
└── index.html    ← tudo em um arquivo único (HTML + CSS + JS)
```

## 🌐 Compatibilidade

- ✅ Chrome / Edge / Firefox / Safari (desktop e mobile)
- ✅ Funciona em celular (responsivo)
- ✅ Sem dependências externas
- ✅ Sem backend necessário

## 📌 Observações

- O link usa o serviço `wa.me` oficial do WhatsApp
- Em **celulares**, abre o app do WhatsApp diretamente
- Em **desktop**, abre o WhatsApp Web
- Nenhum dado é armazenado — tudo acontece no navegador
- O número é formatado automaticamente com código do Brasil (55)

## 📄 Licença

Projeto livre para uso pessoal e profissional.
```

---

## 📌 Resumo do que o README cobre

| Seção | Conteúdo |
|---|---|
| **Descrição** | O que o projeto faz em 1 frase |
| **Funcionalidades** | Tabela com todos os recursos |
| **Como Usar** | Passo a passo para o usuário |
| **Mensagens Padrão** | Textos exatos que são enviados |
| **Como Rodar** | Local e deploy gratuito |
| **Personalização** | Como trocar mensagens, adicionar operadora, mudar cores |
| **Estrutura** | Arquivos do projeto |
| **Compatibilidade** | Navegadores e dispositivos |
| **Observações** | Detalhes técnicos importantes |

É só salvar como `README.md` na mesma pasta do `index.html`. Se for hospedar no **GitHub**, o README aparece automaticamente na página do repositório.
