document.addEventListener('DOMContentLoaded', () => {
    // Animações de entrada ao rolar a página
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-fade-in-up');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });
    document.querySelectorAll('[data-animate]').forEach(el => observer.observe(el));

    // Lógica do Menu Mobile
    const mobileMenuButton = document.getElementById('mobile-menu-button');
    const mobileMenu = document.getElementById('mobile-menu');
    const navLinks = document.querySelectorAll('#mobile-menu a');
    mobileMenuButton.addEventListener('click', () => mobileMenu.classList.toggle('hidden'));
    navLinks.forEach(link => link.addEventListener('click', () => mobileMenu.classList.add('hidden')));

    // Lógica do Agente IA (Chatbot)
    const aiAgentButton = document.getElementById('ai-agent-button');
    const chatWindow = document.getElementById('ai-agent-chat-window');
    const closeChatButton = document.getElementById('close-chat-button');
    const chatBody = document.getElementById('chat-body');
    const chatInput = document.getElementById('chat-input');
    const chatSendButton = document.getElementById('chat-send-button');

    aiAgentButton.addEventListener('click', () => {
        chatWindow.classList.toggle('hidden');
        if (!chatWindow.classList.contains('hidden')) {
            chatWindow.classList.add('animate-scale-in');
        }
    });

    closeChatButton.addEventListener('click', () => chatWindow.classList.add('hidden'));

    const sendMessage = async () => {
        const userMessage = chatInput.value.trim();
        if (userMessage === '') return;

        // Adiciona a mensagem do usuário na tela
        const userMessageDiv = document.createElement('div');
        userMessageDiv.className = 'flex justify-end mb-4';
        userMessageDiv.innerHTML = `<div class="bg-imfy-teal text-white p-3 rounded-lg max-w-xs"><p class="text-sm">${userMessage}</p></div>`;
        chatBody.appendChild(userMessageDiv);
        chatInput.value = '';
        chatBody.scrollTop = chatBody.scrollHeight;

        // Adiciona indicador de "digitando..."
        const typingIndicator = document.createElement('div');
        typingIndicator.className = 'flex justify-start mb-4';
        typingIndicator.id = 'typing-indicator';
        typingIndicator.innerHTML = `<div class="bg-imfy-light-gray p-3 rounded-lg max-w-xs"><p class="text-sm text-gray-700">Digitando...</p></div>`;
        chatBody.appendChild(typingIndicator);
        chatBody.scrollTop = chatBody.scrollHeight;

        // Chama a IA Generativa
        try {
            const aiResponse = await getGenerativeAIResponse(userMessage);
            typingIndicator.remove(); // Remove o indicador
            const aiMessageDiv = document.createElement('div');
            aiMessageDiv.className = 'flex justify-start mb-4';
            aiMessageDiv.innerHTML = `<div class="bg-imfy-light-gray p-3 rounded-lg max-w-xs"><div class="text-sm text-gray-700">${aiResponse}</div></div>`;
            chatBody.appendChild(aiMessageDiv);
            chatBody.scrollTop = chatBody.scrollHeight;
        } catch (error) {
            console.error("Erro ao chamar a API de IA:", error);
            typingIndicator.remove();
            const errorMessageDiv = document.createElement('div');
            errorMessageDiv.className = 'flex justify-start mb-4';
            errorMessageDiv.innerHTML = `<div class="bg-red-100 p-3 rounded-lg max-w-xs"><p class="text-sm text-red-700">Desculpe, ocorreu um erro. Tente novamente mais tarde.</p></div>`;
            chatBody.appendChild(errorMessageDiv);
            chatBody.scrollTop = chatBody.scrollHeight;
        }
    };

    chatSendButton.addEventListener('click', sendMessage);
    chatInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });
    
    async function getGenerativeAIResponse(userQuestion) {
        const lowerCaseMessage = userQuestion.toLowerCase();

        if (lowerCaseMessage.includes('whatsapp')) {
            return `Claro! Para falar conosco pelo WhatsApp, clique no botão abaixo:<br><a href="https://wa.me/5511998514058" target="_blank" class="inline-block mt-2 bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-lg text-sm"><i class="fab fa-whatsapp"></i> Chamar no WhatsApp</a>`;
        }
        if (lowerCaseMessage.includes('email') || lowerCaseMessage.includes('e-mail')) {
            return `Com certeza! Para nos enviar um e-mail, clique no botão abaixo:<br><a href="mailto:imfyempresa@gmail.com?subject=Contato%20via%20Agente%20IA" class="inline-block mt-2 bg-imfy-gold hover:bg-opacity-90 text-white font-bold py-2 px-4 rounded-lg text-sm"><i class="fas fa-envelope"></i> Enviar E-mail</a>`;
        }

        const faqContent = `
            Seção 1: Sobre a Imfy: Seu Parceiro Estratégico no Vale do Paraíba
            P: O que é a Imfy? Vocês têm alguma relação com o FMI (Fundo Monetário Internacional)?
            R: Não, a Imfy Consultoria é uma empresa independente e não possui absolutamente nenhuma relação com o FMI. A Imfy é uma consultoria empresarial brasileira, fundada em 2025, com foco de atuação exclusivo no Vale do Paraíba para impulsionar o crescimento de pequenos negócios.
            P: Qual é a missão da Imfy?
            R: A missão da Imfy é fortalecer pequenos negócios, levando estratégias, análises e conhecimento com o objetivo de aumentar a lucratividade e o faturamento de forma sustentável.
            P: Por que a Imfy foca em pequenos negócios especificamente no Vale do Paraíba?
            R: A Imfy nasceu no Vale do Paraíba e tem um profundo compromisso com o desenvolvimento econômico da região. Este vínculo local nos proporciona um conhecimento profundo sobre a dinâmica econômica, os desafios e as oportunidades únicas das cidades do Vale.
            P: Quem está por trás da Imfy?
            R: A Imfy foi fundada por Raphael Martim Bianco Herrera Baptista, estudante de Engenharia de Produção na UNESP, campus de Guaratinguetá. A Engenharia de Produção é a base da metodologia da empresa, unindo gestão, finanças, otimização de processos e qualidade.
            P: Qual é o principal diferencial da Imfy?
            R: Nosso principal diferencial é a qualidade da entrega com foco total e exclusivo em cada cliente. Desenvolvemos soluções 100% personalizadas, mergulhando na realidade de cada negócio para gerar resultados superiores.

            Seção 2: Nossos Serviços
            - Análise Financeira (DRE, Fluxo de Caixa, Balanço): Resolve a falta de clareza sobre as finanças, permitindo tomar decisões baseadas em dados.
            - Sistemas de Financiamento e Precificação: Ajudamos a escolher o melhor financiamento e a definir preços estratégicos que garantem a margem de lucro.
            - Desenvolvimento de Websites (HTML, CSS, JS): Criamos uma presença digital profissional e moderna para captar novos clientes online.
            - Análise de Dados e Ciência de Dados: Transformamos os dados de vendas e clientes em decisões estratégicas baseadas em fatos, não em intuição.
            - Projetos Lean Six Sigma: Reduzimos custos operacionais, aumentamos a eficiência e a qualidade através da eliminação de desperdícios e erros nos processos.

            Seção 3: Metodologia de Trabalho
            P: Como funciona o processo de consultoria?
            R: Nosso processo tem 5 etapas: 1. Diagnóstico Inicial; 2. Proposta Personalizada; 3. Execução e Colaboração; 4. Entrega e Implementação; 5. Análise de Resultados.
            
            Seção 4: Dúvidas Comuns
            P: Qual é o investimento?
            R: O valor é definido em uma proposta personalizada após o diagnóstico. Nossos projetos são acessíveis para PMEs e desenhados para que o retorno seja significativamente maior que o valor investido.
            P: A consultoria é para MEI ou empresas muito pequenas?
            R: Absolutamente. Nossa metodologia é escalável e se adapta a negócios de todos os portes. Implementar boas práticas desde o início prepara a empresa para um crescimento saudável.
        `;

        const prompt = `
            Você é o "Agente IMFY", um assistente de IA amigável, profissional e prestativo da Imfy Consultoria.
            Sua única fonte de conhecimento é o texto a seguir. Responda à pergunta do usuário baseando-se EXCLUSIVAMENTE neste texto.
            Seja direto e use uma linguagem clara. Mantenha as respostas relativamente curtas.
            Se a resposta para a pergunta do usuário não estiver claramente no texto, responda educadamente: "Essa é uma ótima pergunta. Para te dar uma resposta completa e precisa, sugiro falar com um de nossos especialistas. Você pode nos chamar no WhatsApp ou enviar um e-mail."

            --- INÍCIO DO CONTEÚDO DE CONHECIMENTO ---
            ${faqContent}
            --- FIM DO CONTEÚDO DE CONHECIMENTO ---

            Pergunta do usuário: "${userQuestion}"

            Sua resposta:
        `;
        
        let chatHistory = [];
        chatHistory.push({ role: "user", parts: [{ text: prompt }] });
        const payload = { contents: chatHistory };
        const apiKey = "apiKey" //Acessar https://aistudio.google.com/
        const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=${apiKey}`;
        
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        
        if (result.candidates && result.candidates[0]?.content?.parts?.[0]?.text) {
            return result.candidates[0].content.parts[0].text;
        } else {
            return "Não consegui processar sua pergunta no momento. Que tal tentar reformulá-la? Se preferir, fale com um de nossos especialistas.";
        }
    }

    const blogModal = document.getElementById('blog-modal');
    const openBlogModalButtons = document.querySelectorAll('.open-blog-modal-button');
    const closeBlogModalButton = document.getElementById('close-blog-modal-button');

    openBlogModalButtons.forEach(button => {
        button.addEventListener('click', () => {
            blogModal.classList.remove('hidden');
        });
    });

    closeBlogModalButton.addEventListener('click', () => {
        blogModal.classList.add('hidden');
    });
    
    blogModal.addEventListener('click', (event) => {
        if (event.target === blogModal) {
            blogModal.classList.add('hidden');
        }
    });
});
