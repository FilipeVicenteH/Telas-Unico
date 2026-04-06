let currentStep = 0;
let formData = {
    nome: '',
    whatsapp: '',
    nomeLoja: '',
    prefereNaoDizer: false,
    plataforma: '',
    plataformaOutra: '',
    faturamento: '',
    carrinhoAbandonado: '',
    plataformaCarrinho: '',
    plataformaCarrinhoOutra: '',
    pedidosRecusados: '',
    recuperacao: '',
    posVenda: '',
    atendimento: ''
};

const questions = [
    {
        id: 'nome',
        title: 'Qual é o seu nome?',
        icon: 'mdi-account',
        field: 'nome',
        type: 'text',
        placeholder: 'João Silva'
    },
    {
        id: 'faturamento',
        title: 'Qual o faturamento mensal da sua loja?',
        icon: 'mdi-currency-usd',
        field: 'faturamento',
        options: [
            { value: 'ate10k', label: 'Até R$ 10 mil', points: 1 },
            { value: '10k-30k', label: 'R$ 10 mil a R$ 30 mil', points: 2 },
            { value: '30k-100k', label: 'R$ 30 mil a R$ 100 mil', points: 3 },
            { value: 'acima100k', label: 'Acima de R$ 100 mil', points: 4 }
        ]
    },
    {
        id: 'plataforma',
        title: 'Qual plataforma você usa?',
        icon: 'mdi-cart',
        field: 'plataforma',
        type: 'select',
        options: ['Shopify', 'Nuvemshop', 'Yampi', 'WooCommerce', 'Tray', 'Outra']
    },
    {
        id: 'carrinhoAbandonado',
        title: 'Você recupera carrinhos abandonados ativamente?',
        icon: 'mdi-cart-off',
        field: 'carrinhoAbandonado',
        options: [
            { value: 'nao', label: 'Não faço nada', points: 0, critical: true },
            { value: 'email', label: 'Apenas por e-mail', points: 1 },
            { value: 'whatsapp-manual', label: 'WhatsApp manual', points: 2 },
            { value: 'automatizado', label: 'Sistema automatizado', points: 4 }
        ]
    },
    {
        id: 'plataformaCarrinho',
        title: 'Qual plataforma você usa para recuperar carrinhos?',
        icon: 'mdi-cog',
        field: 'plataformaCarrinho',
        conditional: true,
        showWhen: ['email', 'whatsapp-manual', 'automatizado'],
        options: [
            { value: 'unicodrop', label: 'UnicoDrop', points: 0 },
            { value: 'reportana', label: 'Reportana', points: 0 },
            { value: 'activecampaign', label: 'ActiveCampaign', points: 0 },
            { value: 'dropi', label: 'Dropi', points: 0 },
            { value: 'outra', label: 'Outra plataforma', points: 0 }
        ]
    },
    {
        id: 'pedidosRecusados',
        title: 'Quantos pedidos são recusados por mês (aprox.)?',
        icon: 'mdi-close-circle',
        field: 'pedidosRecusados',
        options: [
            { value: 'nao-sei', label: 'Não sei / Não acompanho', points: 0, critical: true },
            { value: 'ate10', label: 'Até 10% dos pedidos', points: 3 },
            { value: '10-20', label: '10% a 20% dos pedidos', points: 1, warning: true },
            { value: 'acima20', label: 'Mais de 20%', points: 0, critical: true }
        ]
    },
    {
        id: 'recuperacao',
        title: 'Você tenta recuperar pedidos recusados?',
        icon: 'mdi-refresh',
        field: 'recuperacao',
        options: [
            { value: 'nao', label: 'Não tento recuperar', points: 0, critical: true },
            { value: 'as-vezes', label: 'Às vezes, manualmente', points: 1 },
            { value: 'sempre-manual', label: 'Sempre, mas manual', points: 2 },
            { value: 'automatizado', label: 'Tenho automação', points: 4 }
        ]
    },
    {
        id: 'posVenda',
        title: 'Você faz pós-venda automatizado?',
        icon: 'mdi-email-check',
        field: 'posVenda',
        options: [
            { value: 'nao', label: 'Não faço pós-venda', points: 0, warning: true },
            { value: 'email', label: 'Apenas e-mail de agradecimento', points: 1 },
            { value: 'manual', label: 'WhatsApp manual', points: 2 },
            { value: 'automatizado', label: 'Totalmente automatizado', points: 4 }
        ]
    },
    {
        id: 'atendimento',
        title: 'Como funciona seu atendimento ao cliente?',
        icon: 'mdi-headset',
        field: 'atendimento',
        options: [
            { value: 'manual-total', label: 'Tudo manual, respondo um por um', points: 0, warning: true },
            { value: 'equipe', label: 'Tenho equipe de atendimento', points: 2 },
            { value: 'hibrido', label: 'Parte automatizado, parte manual', points: 3 },
            { value: 'automatizado', label: 'Totalmente automatizado', points: 4 }
        ]
    },
    {
        id: 'nomeLoja',
        title: 'Qual é o nome da sua loja?',
        icon: 'mdi-store',
        field: 'nomeLoja',
        type: 'text',
        placeholder: 'Minha Loja Online',
        hasCheckbox: true,
        checkboxLabel: 'Prefiro não dizer'
    },
    {
        id: 'whatsapp',
        title: 'Qual é o seu WhatsApp?',
        icon: 'mdi-whatsapp',
        field: 'whatsapp',
        type: 'tel',
        placeholder: '(11) 99999-9999'
    }
];

// --- Utils principais ---

function showAlert(message, type = 'success') {
    const alertContainer = document.getElementById('alert-container');
    const alert = document.createElement('div');
    alert.className = `alert-custom alert-${type}`;
    alert.innerHTML = `
        <i class="mdi ${type === 'success' ? 'mdi-check-circle' : 'mdi-alert-circle'}"></i>
        <span>${message}</span>
    `;
    alertContainer.appendChild(alert);

    setTimeout(() => {
        alert.style.animation = 'slideInRight 0.3s ease reverse';
        setTimeout(() => alert.remove(), 300);
    }, 5000);
}

function scrollToForm() {
    const formSection = document.getElementById('audit-form');
    if (formSection) {
        // Garante que a primeira pergunta seja renderizada
        currentStep = 0;
        renderQuestion();

        // Aguarda um pouco para a renderização e então faz o scroll
        setTimeout(() => {
            const formRect = formSection.getBoundingClientRect();
            const formTop = formRect.top + window.pageYOffset;
            const formHeight = formRect.height;
            const windowHeight = window.innerHeight;
            const scrollPosition = formTop - (windowHeight / 2) + (formHeight / 2);

            window.scrollTo({
                top: Math.max(0, scrollPosition),
                behavior: 'smooth'
            });
        }, 100);
    }
}

// Máscara telefone
function formatPhone(value) {
    const numbers = value.replace(/\D/g, '');
    if (numbers.length <= 10) {
        return numbers.replace(/(\d{2})(\d{4})(\d{0,4})/, '($1) $2-$3').trim();
    } else {
        return numbers.replace(/(\d{2})(\d{5})(\d{0,4})/, '($1) $2-$3').trim();
    }
}

function validateWhatsApp(whatsapp) {
    const numbers = whatsapp.replace(/\D/g, '');
    return numbers.length >= 10 && numbers.length <= 11;
}
function validateName(name) {
    return name.trim().length >= 2;
}
function validateStoreName(name) {
    return name.trim().length >= 2;
}

function setFieldError(fieldId, hasError) {
    const field = document.getElementById(fieldId);
    if (field) {
        if (hasError) {
            field.classList.add('field-error');
        } else {
            field.classList.remove('field-error');
        }
    }
}

// Flag de processamento para evitar duplo clique
let isProcessing = false;

// Conta perguntas efetivamente exibidas para barra de progresso
function getValidQuestionsCount() {
    let count = 0;
    questions.forEach(q => {
        if (!q.conditional) {
            count++;
        } else {
            const parentQuestion = questions.find(pq => pq.field === 'carrinhoAbandonado');
            if (parentQuestion && q.showWhen.includes(formData.carrinhoAbandonado)) {
                count++;
            }
        }
    });
    return count;
}

// Retorna índice real da pergunta (considerando perguntas puladas)
function getCurrentValidQuestionIndex() {
    let validIndex = 0;
    for (let i = 0; i <= currentStep; i++) {
        const q = questions[i];
        if (!q.conditional) {
            validIndex++;
        } else {
            const parentQuestion = questions.find(pq => pq.field === 'carrinhoAbandonado');
            if (parentQuestion && q.showWhen.includes(formData.carrinhoAbandonado)) {
                validIndex++;
            }
        }
    }
    return validIndex;
}

// Renderiza pergunta (troca de tela no passo-a-passo)
function renderQuestion() {
    let question = questions[currentStep];

    // Se for condicional e não for para mostrar, pula
    if (question.conditional) {
        const parentQuestion = questions.find(q => q.field === 'carrinhoAbandonado');
        if (parentQuestion && !question.showWhen.includes(formData.carrinhoAbandonado)) {
            if (currentStep < questions.length - 1) {
                currentStep++;
                question = questions[currentStep];
            } else {
                showResults();
                return;
            }
        }
    }

    const validQuestionsCount = getValidQuestionsCount();
    const currentValidIndex = getCurrentValidQuestionIndex();
    const progress = (currentValidIndex / validQuestionsCount) * 100;

    const progressBar = document.getElementById('progress-bar');
    if (progressBar) {
        progressBar.style.transition = 'width 0.5s ease';
        progressBar.style.width = `${progress}%`;
    }

    document.getElementById('current-question').textContent = currentValidIndex;
    document.getElementById('total-questions').textContent = validQuestionsCount;

    const questionTitle = document.getElementById('question-title');
    if (question.icon) {
        questionTitle.innerHTML = `<i class="mdi ${question.icon}"></i><span>${question.title}</span>`;
    } else {
        questionTitle.innerHTML = `<span>${question.title}</span>`;
    }

    const questionBody = document.getElementById('question-body');
    questionBody.style.opacity = '0';
    questionBody.style.transform = 'translateY(10px)';

    setTimeout(() => {
        // Perguntas com múltiplos campos (loja-plataforma)
        if (question.fields) {
            questionBody.innerHTML = question.fields.map(field => `
                <div class="form-group-audit">
                    <label class="form-label-audit">
                        ${field.icon ? `<i class="mdi ${field.icon}"></i>` : ''}
                        ${field.label}
                    </label>
                    ${field.type === 'select' ? `
                        <select class="form-control-audit" name="${field.name}" id="field-${field.name}">
                            <option value="">Selecione...</option>
                            ${field.options.map(opt => `
                                <option value="${opt}" ${formData[field.name] === opt ? 'selected' : ''}>${opt}</option>
                            `).join('')}
                        </select>
                        ${field.name === 'plataforma' ? `
                            <div id="plataforma-outra-wrapper" style="display: ${formData.plataforma === 'Outra' ? 'block' : 'none'}; margin-top: 0.75rem;">
                                <label class="form-label-audit">
                                    <i class="mdi mdi-textbox"></i>
                                    Qual plataforma você usa?
                                </label>
                                <input type="text" 
                                       class="form-control-audit" 
                                       name="plataformaOutra" 
                                       id="field-plataformaOutra"
                                       placeholder="Ex: Magento, PrestaShop, etc."
                                       value="${formData.plataformaOutra || ''}">
                            </div>
                        ` : ''}
                    ` : `
                        <input type="${field.type}" 
                               class="form-control-audit ${field.optional ? 'field-optional' : ''}" 
                               name="${field.name}" 
                               id="field-${field.name}"
                               placeholder="${field.placeholder}"
                               value="${formData[field.name] || ''}"
                               ${field.name === 'whatsapp' ? 'maxlength="15"' : ''}>
                        ${field.optional ? '<small class="field-optional-hint"><i class="mdi mdi-information-outline"></i> Este campo é opcional</small>' : ''}
                    `}
                </div>
            `).join('');

            question.fields.forEach(field => {
                const input = document.getElementById(`field-${field.name}`);
                if (input) {
                    if (field.type === 'select' && field.name === 'plataforma') {
                        input.addEventListener('change', (e) => {
                            formData[field.name] = e.target.value;
                            setFieldError(`field-${field.name}`, false);
                            const outraWrapper = document.getElementById('plataforma-outra-wrapper');
                            if (outraWrapper) {
                                if (e.target.value === 'Outra') {
                                    outraWrapper.style.display = 'block';
                                    setTimeout(() => {
                                        const outraInput = document.getElementById('field-plataformaOutra');
                                        if (outraInput) outraInput.focus();
                                    }, 100);
                                } else {
                                    outraWrapper.style.display = 'none';
                                    formData.plataformaOutra = '';
                                }
                            }
                        });
                    } else {
                        input.addEventListener('input', (e) => {
                            let value = e.target.value;
                            if (field.name === 'whatsapp') {
                                value = formatPhone(value);
                                e.target.value = value;
                            }
                            formData[field.name] = field.name === 'whatsapp' ? value.replace(/\D/g, '') : value;
                            setFieldError(`field-${field.name}`, false);
                        });
                        input.addEventListener('blur', (e) => {
                            validateField(field.name, e.target.value);
                        });
                        // Enter vai pro próximo campo ou pergunta, caso não seja select
                        input.addEventListener('keypress', (e) => {
                            if (e.key === 'Enter' && field.name !== 'plataforma') {
                                e.preventDefault();
                                const nextField = question.fields[question.fields.indexOf(field) + 1];
                                if (nextField) {
                                    document.getElementById(`field-${nextField.name}`)?.focus();
                                } else {
                                    nextQuestion();
                                }
                            }
                        });
                    }
                }
            });

            const plataformaOutraInput = document.getElementById('field-plataformaOutra');
            if (plataformaOutraInput) {
                plataformaOutraInput.addEventListener('input', (e) => {
                    formData.plataformaOutra = e.target.value;
                });
            }

            // Foca no primeiro campo
            setTimeout(() => {
                const firstField = document.getElementById(`field-${question.fields[0].name}`);
                if (firstField) firstField.focus();
            }, 100);
        }
        // Perguntas de campo único (nome, whatsapp, nomeLoja)
        else if (question.type) {
            // Campo com checkbox "prefere não dizer"
            if (question.hasCheckbox) {
                questionBody.innerHTML = `
                    <div class="form-group-audit">
                        <input type="${question.type}" 
                               class="form-control-audit" 
                               name="${question.field}" 
                               id="field-${question.field}"
                               placeholder="${question.placeholder}"
                               value="${formData.prefereNaoDizer ? '' : (formData[question.field] || '')}"
                               ${formData.prefereNaoDizer ? 'disabled' : ''}>
                        <div class="checkbox-wrapper" style="margin-top: 0.75rem;">
                            <label class="checkbox-label" style="display: flex; align-items: center; gap: 0.5rem; cursor: pointer;">
                                <input type="checkbox" 
                                       id="checkbox-${question.field}" 
                                       ${formData.prefereNaoDizer ? 'checked' : ''}
                                       style="width: 18px; height: 18px; cursor: pointer;">
                                <span style="font-size: 0.9375rem; color: var(--gray-700);">${question.checkboxLabel}</span>
                            </label>
                        </div>
                    </div>
                `;

                const input = document.getElementById(`field-${question.field}`);
                const checkbox = document.getElementById(`checkbox-${question.field}`);

                if (checkbox) {
                    checkbox.addEventListener('change', (e) => {
                        formData.prefereNaoDizer = e.target.checked;
                        if (e.target.checked) {
                            formData[question.field] = '';
                            if (input) {
                                input.value = '';
                                input.disabled = true;
                            }
                        } else {
                            if (input) {
                                input.disabled = false;
                                input.focus();
                            }
                        }
                    });
                }

                if (input) {
                    input.addEventListener('input', (e) => {
                        formData[question.field] = e.target.value;
                        setFieldError(`field-${question.field}`, false);
                    });
                    input.addEventListener('blur', (e) => {
                        validateField(question.field, e.target.value);
                    });
                    input.addEventListener('keypress', (e) => {
                        if (e.key === 'Enter') {
                            e.preventDefault();
                            nextQuestion();
                        }
                    });
                    if (!formData.prefereNaoDizer) {
                        setTimeout(() => {
                            input.focus();
                        }, 100);
                    }
                }
            }
            // Campo select (plataforma)
            else if (question.type === 'select') {
                questionBody.innerHTML = `
                    <div class="form-group-audit">
                        <select class="form-control-audit" name="${question.field}" id="field-${question.field}">
                            <option value="">Selecione...</option>
                            ${question.options.map(opt => `
                                <option value="${opt}" ${formData[question.field] === opt ? 'selected' : ''}>${opt}</option>
                            `).join('')}
                        </select>
                        ${question.field === 'plataforma' ? `
                            <div id="plataforma-outra-wrapper" style="display: ${formData.plataforma === 'Outra' ? 'block' : 'none'}; margin-top: 0.75rem;">
                                <label class="form-label-audit">
                                    <i class="mdi mdi-textbox"></i>
                                    Qual plataforma você usa?
                                </label>
                                <input type="text" 
                                       class="form-control-audit" 
                                       name="plataformaOutra" 
                                       id="field-plataformaOutra"
                                       placeholder="Ex: Magento, PrestaShop, etc."
                                       value="${formData.plataformaOutra || ''}">
                            </div>
                        ` : ''}
                    </div>
                `;

                const select = document.getElementById(`field-${question.field}`);
                if (select) {
                    select.addEventListener('change', (e) => {
                        formData[question.field] = e.target.value;
                        setFieldError(`field-${question.field}`, false);

                        if (question.field === 'plataforma') {
                            const outraWrapper = document.getElementById('plataforma-outra-wrapper');
                            if (outraWrapper) {
                                if (e.target.value === 'Outra') {
                                    outraWrapper.style.display = 'block';
                                    setTimeout(() => {
                                        const outraInput = document.getElementById('field-plataformaOutra');
                                        if (outraInput) outraInput.focus();
                                    }, 100);
                                } else {
                                    outraWrapper.style.display = 'none';
                                    formData.plataformaOutra = '';
                                }
                            }
                        }
                    });
                }

                const plataformaOutraInput = document.getElementById('field-plataformaOutra');
                if (plataformaOutraInput) {
                    plataformaOutraInput.addEventListener('input', (e) => {
                        formData.plataformaOutra = e.target.value;
                    });
                }
            }
            // Campo de texto normal (nome, whatsapp)
            else {
                questionBody.innerHTML = `
                    <div class="form-group-audit">
                        <input type="${question.type}" 
                               class="form-control-audit" 
                               name="${question.field}" 
                               id="field-${question.field}"
                               placeholder="${question.placeholder}"
                               value="${formData[question.field] || ''}"
                               ${question.field === 'whatsapp' ? 'maxlength="15"' : ''}>
                    </div>
                `;

                const input = document.getElementById(`field-${question.field}`);
                if (input) {
                    input.addEventListener('input', (e) => {
                        let value = e.target.value;
                        if (question.field === 'whatsapp') {
                            value = formatPhone(value);
                            e.target.value = value;
                        }
                        formData[question.field] = question.field === 'whatsapp' ? value.replace(/\D/g, '') : value;
                        setFieldError(`field-${question.field}`, false);
                    });
                    input.addEventListener('blur', (e) => {
                        validateField(question.field, e.target.value);
                    });
                    input.addEventListener('keypress', (e) => {
                        if (e.key === 'Enter') {
                            e.preventDefault();
                            nextQuestion();
                        }
                    });
                    setTimeout(() => {
                        input.focus();
                    }, 100);
                }
            }
        }
        // Perguntas de múltipla escolha
        else {
            questionBody.innerHTML = `
                <div class="option-button-wrapper">
                    ${question.options.map(option => `
                        <button type="button" 
                                class="option-button ${formData[question.field] === option.value ? 'selected' : ''} ${option.critical ? 'has-badge critical-badge' : ''} ${option.warning ? 'has-badge warning-badge' : ''}"
                                onclick="selectOption('${question.field}', '${option.value}')"
                                data-value="${option.value}">
                            <div class="option-header">
                                <div class="option-content">
                                    <span class="option-label">${option.label}</span>
                                    ${formData[question.field] === option.value ? '<i class="mdi mdi-check-circle option-icon"></i>' : ''}
                                </div>
                                ${option.critical ? '<span class="option-badge critical"><i class="mdi mdi-alert-circle"></i> Ponto crítico</span>' : ''}
                                ${option.warning ? '<span class="option-badge warning"><i class="mdi mdi-alert"></i> Atenção</span>' : ''}
                            </div>
                        </button>
                    `).join('')}
                </div>
                ${question.id === 'plataformaCarrinho' ? `
                    <div id="plataforma-carrinho-outra-wrapper" style="display: ${formData.plataformaCarrinho === 'outra' ? 'block' : 'none'}; margin-top: 1rem;">
                        <label class="form-label-audit">
                            <i class="mdi mdi-textbox"></i>
                            Qual plataforma você usa?
                        </label>
                        <input type="text" 
                               class="form-control-audit" 
                               name="plataformaCarrinhoOutra" 
                               id="field-plataformaCarrinhoOutra"
                               placeholder="Ex: ActiveCampaign, SendGrid, etc."
                               value="${formData.plataformaCarrinhoOutra || ''}">
                    </div>
                ` : ''}
            `;
            if (question.id === 'plataformaCarrinho') {
                setTimeout(() => {
                    const outraWrapper = document.getElementById('plataforma-carrinho-outra-wrapper');
                    if (outraWrapper && formData.plataformaCarrinho === 'outra') {
                        const outraInput = document.getElementById('field-plataformaCarrinhoOutra');
                        if (outraInput) {
                            outraInput.addEventListener('input', (e) => {
                                formData.plataformaCarrinhoOutra = e.target.value;
                            });
                            outraInput.focus();
                        }
                    }
                }, 100);
            }
        }

        questionBody.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
        questionBody.style.opacity = '1';
        questionBody.style.transform = 'translateY(0)';
    }, 50);

    const btnBack = document.getElementById('btn-back');
    const btnNext = document.getElementById('btn-next');
    const btnNextText = document.getElementById('btn-next-text');

    btnBack.style.display = currentStep > 0 ? 'block' : 'none';
    if (btnNextText) {
        const nextIndex = getNextQuestionIndex();
        btnNextText.textContent = nextIndex >= questions.length ? 'Ver Resultados' : 'Próxima';
    }

    // Scroll para deixar o card visualmente ao centro
    if (currentStep > 0) {
        setTimeout(() => {
            const questionCard = document.querySelector('.question-card-form');
            if (questionCard) {
                const cardRect = questionCard.getBoundingClientRect();
                const cardTop = cardRect.top + window.pageYOffset;
                const cardHeight = cardRect.height;
                const windowHeight = window.innerHeight;
                const scrollPosition = cardTop - (windowHeight / 2) + (cardHeight / 2);

                window.scrollTo({
                    top: Math.max(0, scrollPosition),
                    behavior: 'smooth'
                });
            }
        }, 100);
    }
}

// Validação campos iniciais
function validateField(fieldName, value) {
    let isValid = true;

    switch (fieldName) {
        case 'nome':
            isValid = validateName(value);
            if (!isValid) {
                showAlert('Por favor, informe seu nome completo', 'danger');
            }
            break;
        case 'whatsapp':
            isValid = validateWhatsApp(value);
            if (!isValid) {
                showAlert('Por favor, informe um WhatsApp válido com DDD', 'danger');
            }
            break;
        case 'nomeLoja':
            isValid = true; // opcional
            break;
        case 'plataforma':
            isValid = value.trim() !== '';
            if (!isValid) {
                showAlert('Por favor, selecione a plataforma que você usa', 'danger');
            }
            break;
    }
    setFieldError(`field-${fieldName}`, !isValid);
    return isValid;
}

// Retorna índice da próxima pergunta válida
function getNextQuestionIndex() {
    const currentQuestion = questions[currentStep];

    // Se na pergunta do carrinho, talvez tenha condicional a seguir
    if (currentQuestion.field === 'carrinhoAbandonado') {
        const conditionalQuestion = questions.find(q => q.id === 'plataformaCarrinho');
        if (conditionalQuestion && conditionalQuestion.showWhen.includes(formData.carrinhoAbandonado)) {
            if (!formData.plataformaCarrinho) {
                const conditionalIndex = questions.findIndex(q => q.id === 'plataformaCarrinho');
                if (conditionalIndex !== -1) {
                    return conditionalIndex;
                }
            }
        }
    }

    let nextIndex = currentStep + 1;
    while (nextIndex < questions.length) {
        const nextQuestion = questions[nextIndex];
        if (nextQuestion.conditional) {
            const parentQuestion = questions.find(q => q.field === 'carrinhoAbandonado');
            if (parentQuestion && !nextQuestion.showWhen.includes(formData.carrinhoAbandonado)) {
                nextIndex++;
                continue;
            }
        }
        break;
    }
    return nextIndex;
}

// Handler para múltipla-escolha
function selectOption(field, value) {
    formData[field] = value;

    const buttons = document.querySelectorAll(`.option-button[data-value]`);
    buttons.forEach(btn => {
        if (btn.getAttribute('data-value') === value) {
            btn.classList.add('selected');
            btn.querySelector('.option-icon')?.remove();
            const icon = document.createElement('i');
            icon.className = 'mdi mdi-check-circle option-icon';
            btn.querySelector('.option-content')?.appendChild(icon);
        } else {
            btn.classList.remove('selected');
            btn.querySelector('.option-icon')?.remove();
        }
    });

    // Se "outra", não avança automaticamente até input completo
    if (field === 'plataformaCarrinho') {
        const outraWrapper = document.getElementById('plataforma-carrinho-outra-wrapper');
        if (outraWrapper) {
            if (value === 'outra') {
                outraWrapper.style.display = 'block';
                setTimeout(() => {
                    const outraInput = document.getElementById('field-plataformaCarrinhoOutra');
                    if (outraInput) outraInput.focus();
                }, 100);
            } else {
                outraWrapper.style.display = 'none';
                formData.plataformaCarrinhoOutra = '';
            }
        }
        if (value !== 'outra') {
            setTimeout(() => {
                nextQuestion();
            }, 300);
        }
        return;
    }

    // Vai para a próxima adequada
    const nextIndex = getNextQuestionIndex();
    if (nextIndex < questions.length && nextIndex !== currentStep + 1) {
        setTimeout(() => {
            currentStep = nextIndex;
            renderQuestion();
        }, 300);
    } else if (nextIndex < questions.length) {
        setTimeout(() => {
            nextQuestion();
        }, 300);
    }
}

// Próxima etapa/pergunta (valida antes de avançar)
function nextQuestion() {
    if (isProcessing) return;
    const question = questions[currentStep];
    let isValid = true;

    // Perguntas com múltiplos campos (loja-plataforma)
    if (question.fields) {
        question.fields.forEach(field => {
            if (field.name === 'nomeLoja') {
                // Campo opcional - não valida
            } else if (field.name === 'plataforma') {
                if (!formData.plataforma || formData.plataforma.trim() === '') {
                    setFieldError('field-plataforma', true);
                    isValid = false;
                } else if (formData.plataforma === 'Outra') {
                    if (!formData.plataformaOutra || formData.plataformaOutra.trim() === '') {
                        setFieldError('field-plataformaOutra', true);
                        isValid = false;
                    }
                }
            }
        });
        if (!isValid) {
            showAlert('Por favor, preencha todos os campos obrigatórios', 'danger');
            return;
        }
    }
    // Perguntas de campo único (nome, whatsapp, nomeLoja, plataforma)
    else if (question.type) {
        if (question.field === 'nome') {
            if (!validateName(formData.nome)) {
                setFieldError('field-nome', true);
                isValid = false;
            }
        } else if (question.field === 'whatsapp') {
            if (!validateWhatsApp(formData.whatsapp)) {
                setFieldError('field-whatsapp', true);
                isValid = false;
            }
        } else if (question.field === 'plataforma') {
            if (!formData.plataforma || formData.plataforma.trim() === '') {
                setFieldError('field-plataforma', true);
                isValid = false;
            } else if (formData.plataforma === 'Outra') {
                if (!formData.plataformaOutra || formData.plataformaOutra.trim() === '') {
                    setFieldError('field-plataformaOutra', true);
                    isValid = false;
                }
            }
        } else if (question.field === 'nomeLoja') {
            // Campo opcional - se checkbox marcado, não precisa validar
            if (!formData.prefereNaoDizer && !formData.nomeLoja.trim()) {
                // Pode estar vazio, não é obrigatório
            }
        }
        if (!isValid) {
            showAlert('Por favor, preencha o campo corretamente', 'danger');
            return;
        }
    }
    // Perguntas de múltipla escolha
    else {
        if (!formData[question.field]) {
            showAlert('Por favor, selecione uma opção antes de continuar', 'danger');
            const buttons = document.querySelectorAll('.option-button');
            buttons.forEach(btn => {
                btn.style.animation = 'shake 0.5s ease';
            });
            setTimeout(() => {
                buttons.forEach(btn => btn.style.animation = '');
            }, 500);
            return;
        }
        // Se "outra plataforma", exige preencher nome
        if (question.id === 'plataformaCarrinho' && formData.plataformaCarrinho === 'outra') {
            if (!formData.plataformaCarrinhoOutra || formData.plataformaCarrinhoOutra.trim() === '') {
                showAlert('Por favor, informe qual plataforma você usa', 'danger');
                const outraInput = document.getElementById('field-plataformaCarrinhoOutra');
                if (outraInput) {
                    outraInput.classList.add('field-error');
                    outraInput.focus();
                }
                return;
            }
        }
    }

    if (currentStep < questions.length - 1) {
        isProcessing = true;
        currentStep++;

        let nextQuestion = questions[currentStep];
        if (nextQuestion && nextQuestion.conditional) {
            const parentQuestion = questions.find(q => q.field === 'carrinhoAbandonado');
            if (parentQuestion && !nextQuestion.showWhen.includes(formData.carrinhoAbandonado)) {
                if (currentStep < questions.length - 1) {
                    currentStep++;
                } else {
                    isProcessing = false;
                    showResults();
                    return;
                }
            }
        }
        renderQuestion();
        setTimeout(() => {
            isProcessing = false;
        }, 600);
    } else {
        isProcessing = true;
        showResults();
    }
}

function previousQuestion() {
    if (isProcessing) return;
    if (currentStep > 0) {
        isProcessing = true;
        currentStep--;
        let prevQuestion = questions[currentStep];
        if (prevQuestion && prevQuestion.conditional) {
            const parentQuestion = questions.find(q => q.field === 'carrinhoAbandonado');
            if (parentQuestion && !prevQuestion.showWhen.includes(formData.carrinhoAbandonado)) {
                if (currentStep > 0) {
                    currentStep--;
                } else {
                    isProcessing = false;
                    return;
                }
            }
        }
        renderQuestion();
        setTimeout(() => {
            isProcessing = false;
        }, 600);
    }
}

// Calcula pontuação e destaca gargalos
function calculateResults() {
    let totalPoints = 0;
    let maxPoints = 0;
    const issues = [];

    const fatQuestion = questions.find(q => q.id === 'faturamento');
    const fatPoints = fatQuestion?.options.find(o => o.value === formData.faturamento)?.points || 0;
    totalPoints += fatPoints;
    maxPoints += 4;

    const carrQuestion = questions.find(q => q.id === 'carrinhoAbandonado');
    const carrPoints = carrQuestion?.options.find(o => o.value === formData.carrinhoAbandonado)?.points || 0;
    totalPoints += carrPoints * 2;
    maxPoints += 8;
    if (carrPoints <= 1) {
        issues.push({
            type: 'critical',
            title: 'Carrinho Abandonado',
            desc: 'Você está perdendo entre 60-80% das vendas potenciais',
            impact: 'R$ 2.400 a R$ 4.800/mês',
            icon: 'mdi-cart-off'
        });
    }

    const pedidosQuestion = questions.find(q => q.id === 'pedidosRecusados');
    const pedidosPoints = pedidosQuestion?.options.find(o => o.value === formData.pedidosRecusados)?.points || 0;
    totalPoints += pedidosPoints * 2;
    maxPoints += 6;
    if (pedidosPoints <= 1) {
        issues.push({
            type: 'critical',
            title: 'Pedidos Recusados',
            desc: 'Alto índice de recusas sem acompanhamento',
            impact: 'R$ 800 a R$ 2.100/mês',
            icon: 'mdi-close-circle'
        });
    }

    const recQuestion = questions.find(q => q.id === 'recuperacao');
    const recPoints = recQuestion?.options.find(o => o.value === formData.recuperacao)?.points || 0;
    totalPoints += recPoints * 1.5;
    maxPoints += 6;
    if (recPoints <= 1) {
        issues.push({
            type: 'warning',
            title: 'Recuperação de Vendas',
            desc: 'Sem processo para recuperar pedidos perdidos',
            impact: 'R$ 400 a R$ 1.200/mês',
            icon: 'mdi-refresh'
        });
    }

    const posQuestion = questions.find(q => q.id === 'posVenda');
    const posPoints = posQuestion?.options.find(o => o.value === formData.posVenda)?.points || 0;
    totalPoints += posPoints;
    maxPoints += 4;
    if (posPoints <= 1) {
        issues.push({
            type: 'warning',
            title: 'Pós-Venda',
            desc: 'Perdendo oportunidade de fidelização e upsell',
            impact: 'R$ 300 a R$ 900/mês',
            icon: 'mdi-email-check'
        });
    }

    const atendQuestion = questions.find(q => q.id === 'atendimento');
    const atendPoints = atendQuestion?.options.find(o => o.value === formData.atendimento)?.points || 0;
    totalPoints += atendPoints;
    maxPoints += 4;

    const score = Math.round((totalPoints / maxPoints) * 100);
    return { score, issues };
}

// Exibe resultados finais
function showResults() {
    const { score, issues } = calculateResults();
    const criticalIssues = issues.filter(i => i.type === 'critical');
    const warningIssues = issues.filter(i => i.type === 'warning');

    let scoreClass = 'excellent';
    let scoreMessage = 'Excelente! Sua loja está bem otimizada';

    if (score < 50) {
        scoreClass = 'poor';
        scoreMessage = 'Atenção! Você está perdendo muito dinheiro';
    } else if (score < 70) {
        scoreClass = 'good';
        scoreMessage = 'Bom, mas há muito espaço para melhorar';
    }

    const totalImpact = issues.reduce((sum, issue) => {
        const values = issue.impact.match(/\d+/g);
        return sum + (parseInt(values[1]) || 0);
    }, 0);

    // Salva resultado da auditoria no localStorage
    const auditData = {
        ...formData,
        score,
        issues,
        mainIssue: criticalIssues[0]?.title || warningIssues[0]?.title || 'Nenhum problema crítico',
        timestamp: new Date().toISOString(),
        totalLoss: totalImpact
    };

    try {
        localStorage.setItem('audit_' + formData.whatsapp, JSON.stringify(auditData));
    } catch (e) {
        console.log('LocalStorage não disponível');
    }

    document.getElementById('audit-form').style.display = 'none';
    const resultsSection = document.getElementById('results-section');
    resultsSection.style.display = 'block';

    const resultsWrapper = resultsSection.querySelector('.results-wrapper');
    resultsWrapper.style.opacity = '0';
    resultsWrapper.style.transform = 'translateY(20px)';

    resultsWrapper.innerHTML = `
        <div class="results-card">
            <div class="results-header">
                <div class="results-badge">
                    <i class="mdi mdi-chart-line"></i>
                    Auditoria Completa
                </div>
                <h1 class="results-title">${formData.nome}</h1>
                <p class="results-subtitle">Análise dos 7 pontos críticos da sua operação</p>
            </div>

            <div class="score-card ${scoreClass}">
                <div class="score-icon">
                    ${score >= 70 ? '<i class="mdi mdi-trophy"></i>' : score >= 50 ? '<i class="mdi mdi-chart-line"></i>' : '<i class="mdi mdi-alert"></i>'}
                </div>
                <div class="score-number">${score}</div>
                <div class="score-label">Pontos de 100</div>
                <p class="score-message">${scoreMessage}</p>
            </div>

            ${criticalIssues.length > 0 ? `
                <div class="issues-section critical-section">
                    <h3 class="issues-title critical-title">
                        <i class="mdi mdi-alert-circle"></i>
                        Problemas Críticos Encontrados
                    </h3>
                    <div class="issues-list">
                        ${criticalIssues.map(issue => `
                            <div class="issue-card critical">
                                <div class="issue-icon-wrapper">
                                    <i class="mdi ${issue.icon}"></i>
                                </div>
                                <div class="issue-content">
                                    <h4 class="issue-title">${issue.title}</h4>
                                    <p class="issue-description">${issue.desc}</p>
                                    <div class="issue-impact critical">
                                        <i class="mdi mdi-trending-down"></i>
                                        <span>Perda estimada: <strong>${issue.impact}</strong></span>
                                    </div>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            ` : ''}

            ${warningIssues.length > 0 ? `
                <div class="issues-section warning-section">
                    <h3 class="issues-title warning-title">
                        <i class="mdi mdi-alert"></i>
                        Pontos de Atenção
                    </h3>
                    <div class="issues-list">
                        ${warningIssues.map(issue => `
                            <div class="issue-card warning">
                                <div class="issue-icon-wrapper">
                                    <i class="mdi ${issue.icon}"></i>
                                </div>
                                <div class="issue-content">
                                    <h4 class="issue-title">${issue.title}</h4>
                                    <p class="issue-description">${issue.desc}</p>
                                    <div class="issue-impact warning">
                                        <i class="mdi mdi-trending-up"></i>
                                        <span>Oportunidade: <strong>${issue.impact}</strong></span>
                                    </div>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            ` : ''}

            ${issues.length > 0 ? `
                <div class="total-loss-card">
                    <div class="total-loss-icon">
                        <i class="mdi mdi-cash-multiple"></i>
                    </div>
                    <h3 class="total-loss-title">Perda Total Estimada</h3>
                    <div class="total-loss-amount">
                        R$ ${totalImpact.toLocaleString('pt-BR')}
                    </div>
                    <p class="total-loss-subtitle">por mês em vendas perdidas</p>
                </div>
            ` : ''}

            <div class="cta-card">
                <div class="cta-icon">
                    <i class="mdi mdi-whatsapp"></i>
                </div>
                ${score >= 70 ? `
                    <h3 class="cta-title">Parabéns! Sua loja está bem otimizada</h3>
                    <p class="cta-text">Gostaria de conhecer a Único Drop e como podemos ajudar a melhorar ainda mais os resultados da sua empresa?</p>
                    <button class="btn-cta" onclick="handleWhatsApp()">
                        <span>Quero Conhecer a Único Drop</span>
                        <i class="mdi mdi-arrow-right"></i>
                    </button>
                    <p class="cta-footer">
                        <i class="mdi mdi-message-text"></i>
                        Converse com nosso time • Sem compromisso • Veja como evoluir ainda mais
                    </p>
                ` : `
                    <h3 class="cta-title">Próximo Passo: Demo Personalizada</h3>
                    <div class="cta-highlight">
                        <i class="mdi mdi-alert-circle"></i>
                        <span>Seu maior gargalo: <strong>${criticalIssues[0]?.title || warningIssues[0]?.title || 'Recuperação de carrinho'}</strong></span>
                    </div>
                    <p class="cta-text">Agende uma demonstração gratuita para ver como corrigir cada ponto no piloto automático. Sessão de 10 minutos — sem compromisso.</p>
                    <button class="btn-cta" onclick="handleWhatsApp()">
                        <span>Agendar Demo Gratuita</span>
                        <i class="mdi mdi-arrow-right"></i>
                    </button>
                    <p class="cta-footer">
                        <i class="mdi mdi-lightning-bolt"></i>
                        Demonstração de 10 minutos • Sem compromisso • Trial com configuração guiada
                    </p>
                `}
            </div>
        </div>

        <div class="results-footer">
            <p>Único Drop © 2025 • Automação que recupera vendas perdidas</p>
        </div>
    `;

    setTimeout(() => {
        resultsWrapper.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        resultsWrapper.style.opacity = '1';
        resultsWrapper.style.transform = 'translateY(0)';

        const cards = resultsWrapper.querySelectorAll('.score-card, .issue-card, .total-loss-card, .cta-card');
        cards.forEach((card, index) => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(20px)';
            setTimeout(() => {
                card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            }, 100 * (index + 1));
        });
    }, 50);

    resultsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// Gera mensagem personalizada do WhatsApp
function handleWhatsApp() {
    const { score, issues } = calculateResults();
    const mainIssue = issues.find(i => i.type === 'critical') || issues[0];
    const phone = '5511999999999'; // número aqui!
    const lojaText = formData.prefereNaoDizer ? 'da minha loja' : (formData.nomeLoja && formData.nomeLoja.trim() ? `da loja ${formData.nomeLoja}` : 'da minha loja');
    let message = '';

    if (score >= 70) {
        message = encodeURIComponent(
            `Olá! Sou ${formData.nome} ${lojaText}.\n\n` +
            `Acabei de fazer a Auditoria de 7 Pontos e minha pontuação foi ${score}/100 - está tudo bem otimizado! ✅\n\n` +
            `Gostaria de conhecer melhor a Único Drop e ver como vocês podem me ajudar a melhorar ainda mais os resultados da minha empresa.`
        );
    } else {
        message = encodeURIComponent(
            `Olá! Sou ${formData.nome} ${lojaText}.\n\n` +
            `Acabei de fazer a Auditoria de 7 Pontos e minha pontuação foi ${score}/100.\n\n` +
            `Meu maior gargalo identificado: ${mainIssue?.title || 'Recuperação de carrinho'}\n\n` +
            `Gostaria de agendar uma demo de 10 minutos para ver como corrigir isso!`
        );
    }

    window.open(`https://wa.me/${phone}?text=${message}`, '_blank');
}

// Auto init no carregamento da página
document.addEventListener('DOMContentLoaded', function () {
    window.scrollTo(0, 0);
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;

    if (window.location.hash) {
        window.history.replaceState(null, null, window.location.pathname);
    }

    if ('scrollRestoration' in history) {
        history.scrollRestoration = 'manual';
    }

    // Não renderiza a pergunta automaticamente - só quando o usuário clicar no botão
    // Funções no window para uso inline no HTML
    window.selectOption = selectOption;
    window.nextQuestion = nextQuestion;
    window.previousQuestion = previousQuestion;
    window.handleWhatsApp = handleWhatsApp;
    window.scrollToForm = scrollToForm;
});

