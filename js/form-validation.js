// Validação de formulário e máscaras
document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('registrationForm');
    const inputs = form.querySelectorAll('input, select, textarea');

    // Máscaras para os campos
    const masks = {
        phone: function(value) {
            return value
                .replace(/\D/g, '')
                .replace(/(\d{2})(\d)/, '($1) $2')
                .replace(/(\d{4,5})(\d{4})$/, '$1-$2');
        },
        cpf: function(value) {
            return value
                .replace(/\D/g, '')
                .replace(/(\d{3})(\d)/, '$1.$2')
                .replace(/(\d{3})(\d)/, '$1.$2')
                .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
        },
        cep: function(value) {
            return value
                .replace(/\D/g, '')
                .replace(/(\d{5})(\d)/, '$1-$2')
                .replace(/(-\d{3})\d+?$/, '$1');
        },
        cnpj: function(value) {
            return value
                .replace(/\D/g, '')
                .replace(/(\d{2})(\d)/, '$1.$2')
                .replace(/(\d{3})(\d)/, '$1.$2')
                .replace(/(\d{3})(\d)/, '$1/$2')
                .replace(/(\d{4})(\d)/, '$1-$2')
                .replace(/(-\d{2})\d+?$/, '$1');
        }
    };

    // Aplicar máscaras
    function applyMask(input, maskType) {
        input.addEventListener('input', function(e) {
            const value = e.target.value;
            e.target.value = masks[maskType](value);
        });
    }

    // Aplicar máscaras aos campos específicos
    applyMask(document.getElementById('phone'), 'phone');
    applyMask(document.getElementById('cpf'), 'cpf');
    applyMask(document.getElementById('cep'), 'cep');
    applyMask(document.getElementById('cnpj'), 'cnpj');

    // Validação em tempo real
    inputs.forEach(input => {
        input.addEventListener('blur', function() {
            validateField(this);
        });

        input.addEventListener('input', function() {
            clearError(this);
        });
    });

    // Validação de campo individual
    function validateField(field) {
        const value = field.value.trim();
        const errorElement = document.getElementById(field.id + 'Error');

        // Limpar erro anterior
        clearError(field);

        // Validações específicas por tipo de campo
        let isValid = true;
        let errorMessage = '';

        switch(field.type) {
            case 'email':
                if (!isValidEmail(value)) {
                    isValid = false;
                    errorMessage = 'Por favor, insira um e-mail válido.';
                }
                break;

            case 'tel':
                if (!isValidPhone(value)) {
                    isValid = false;
                    errorMessage = 'Por favor, insira um telefone válido.';
                }
                break;

            case 'text':
                if (field.id === 'cpf' && !isValidCPF(value)) {
                    isValid = false;
                    errorMessage = 'Por favor, insira um CPF válido.';
                } else if (field.id === 'cep' && !isValidCEP(value)) {
                    isValid = false;
                    errorMessage = 'Por favor, insira um CEP válido.';
                } else if (field.required && value === '') {
                    isValid = false;
                    errorMessage = 'Este campo é obrigatório.';
                }
                break;

            case 'date':
                if (field.required && value === '') {
                    isValid = false;
                    errorMessage = 'Este campo é obrigatório.';
                } else if (value && new Date(value) > new Date('2006-12-31')) {
                    isValid = false;
                    errorMessage = 'Você deve ter pelo menos 18 anos.';
                }
                break;

            default:
                if (field.required && value === '') {
                    isValid = false;
                    errorMessage = 'Este campo é obrigatório.';
                }
        }

        if (!isValid) {
            showError(field, errorMessage);
        } else {
            markAsValid(field);
        }

        return isValid;
    }

    // Funções de validação específicas
    function isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    function isValidPhone(phone) {
        const phoneRegex = /^\(\d{2}\)\s\d{4,5}-\d{4}$/;
        return phoneRegex.test(phone);
    }

    function isValidCPF(cpf) {
        const cpfRegex = /^\d{3}\.\d{3}\.\d{3}-\d{2}$/;
        return cpfRegex.test(cpf);
    }

    function isValidCEP(cep) {
        const cepRegex = /^\d{5}-\d{3}$/;
        return cepRegex.test(cep);
    }

    // Manipulação de erros
    function showError(field, message) {
        field.style.borderColor = 'var(--error-color)';
        const errorElement = document.getElementById(field.id + 'Error');
        if (errorElement) {
            errorElement.textContent = message;
            errorElement.style.display = 'block';
        }
    }

    function clearError(field) {
        field.style.borderColor = 'var(--border-color)';
        const errorElement = document.getElementById(field.id + 'Error');
        if (errorElement) {
            errorElement.textContent = '';
            errorElement.style.display = 'none';
        }
    }

    function markAsValid(field) {
        field.style.borderColor = 'var(--success-color)';
    }

    // Validação do formulário completo
    form.addEventListener('submit', function(e) {
        e.preventDefault();

        let isFormValid = true;
        const requiredFields = form.querySelectorAll('[required]');

        requiredFields.forEach(field => {
            if (!validateField(field)) {
                isFormValid = false;
            }
        });

        if (isFormValid) {
            // Simular envio do formulário
            showSuccessMessage();
        } else {
            showErrorMessage();
        }
    });

    function showSuccessMessage() {
        alert('Cadastro realizado com sucesso! Em breve entraremos em contato.');
        form.reset();

        // Reset visual
        inputs.forEach(input => {
            clearError(input);
            input.style.borderColor = 'var(--border-color)';
        });
    }

    function showErrorMessage() {
        alert('Por favor, corrija os erros destacados no formulário antes de enviar.');

        // Rolar para o primeiro erro
        const firstError = form.querySelector('.error-message[style*="display: block"]');
        if (firstError) {
            firstError.scrollIntoView({
                behavior: 'smooth',
                block: 'center'
            });
        }
    }

    // Preenchimento automático de endereço via CEP
    const cepInput = document.getElementById('cep');
    cepInput.addEventListener('blur', function() {
        const cep = this.value.replace(/\D/g, '');

        if (cep.length === 8) {
            fetch(`https://viacep.com.br/ws/${cep}/json/`)
                .then(response => response.json())
                .then(data => {
                    if (!data.erro) {
                        document.getElementById('address').value = data.logradouro;
                        document.getElementById('city').value = data.localidade;
                        document.getElementById('state').value = data.uf;
                    }
                })
                .catch(error => {
                    console.error('Erro ao buscar CEP:', error);
                });
        }
    });
});