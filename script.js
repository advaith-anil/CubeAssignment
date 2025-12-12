document.addEventListener('DOMContentLoaded', function() {
    const initCounterAnimation = () => {
        const numValues = document.querySelectorAll('.num-value');
        let hasAnimated = false;

        const startCounting = () => {
            if (hasAnimated) return;
            hasAnimated = true;

            numValues.forEach(element => {
                const finalValue = element.textContent.trim();
                const numericValue = parseInt(finalValue);
                let currentValue = 0;
                const increment = Math.ceil(numericValue / 120); 
                const duration = 1500;
                const startTime = Date.now();

                const animate = () => {
                    const elapsed = Date.now() - startTime;
                    const progress = Math.min(elapsed / duration, 1);
                    currentValue = Math.floor(numericValue * progress);
                    
                    element.textContent = currentValue + '%';
                    
                    if (progress < 1) {
                        requestAnimationFrame(animate);
                    } else {
                        element.textContent = finalValue;
                    }
                };

                animate();
            });
        };

        const numbersSection = document.querySelector('.numbers');
        if (!numbersSection) return;

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    startCounting();
                    observer.unobserve(numbersSection);
                }
            });
        }, { threshold: 0.5 });

        observer.observe(numbersSection);
    };

    initCounterAnimation();

    const searchToggle = document.querySelector('.search-toggle');
    const searchInput = document.querySelector('.search-input');
    
    if (searchToggle && searchInput) {
        searchToggle.addEventListener('click', function(e) {
            const isActive = searchInput.classList.contains('active');
            searchInput.classList.toggle('active');
            this.setAttribute('aria-expanded', String(!isActive));
            this.classList.toggle('open', !isActive);
            
            if (!isActive) {
                searchInput.focus();
                this.querySelector('i').classList.remove('fa-search');
                this.querySelector('i').classList.add('fa-times');
            } else {
                this.querySelector('i').classList.remove('fa-times');
                this.querySelector('i').classList.add('fa-search');
                searchInput.value = '';
            }
            e.stopPropagation();
        });
        
        document.addEventListener('click', (e) => {
            if (!searchInput.contains(e.target) && !searchToggle.contains(e.target)) {
                if (searchInput.classList.contains('active')) {
                    searchInput.classList.remove('active');
                    searchToggle.setAttribute('aria-expanded', 'false');
                    searchToggle.querySelector('i').classList.remove('fa-times');
                    searchToggle.querySelector('i').classList.add('fa-search');
                    searchToggle.classList.remove('open');
                    searchInput.value = '';
                }
            }
        });
    }

    const btn = document.querySelector('.hamburger');
    if (!btn) return; 

    const mobile = document.createElement('nav');
    mobile.className = 'mobile-nav';
    mobile.id = 'mobileNav';
    mobile.setAttribute('aria-hidden','true');

    const desktopLinks = document.querySelectorAll('.navbar a');
    desktopLinks.forEach(a => {
        const link = a.cloneNode(true);
        const unwantedIcons = link.querySelectorAll('i.fa-caret-down, i.fa-caret-up');
        unwantedIcons.forEach(ic => ic.remove());

        link.addEventListener('click', ()=> {
            mobile.classList.remove('show');
            btn.setAttribute('aria-expanded','false');
            mobile.setAttribute('aria-hidden','true');
        });
        mobile.appendChild(link);
    });
    
    const container = document.querySelector('.navbar-container');
    if (container) container.appendChild(mobile);

    btn.addEventListener('click', function(e){
        const expanded = this.getAttribute('aria-expanded') === 'true';
        this.setAttribute('aria-expanded', String(!expanded));
        mobile.classList.toggle('show');
        mobile.setAttribute('aria-hidden', String(expanded));
        const icon = this.querySelector('i');
        if (icon) {
            if (mobile.classList.contains('show')) {
                icon.classList.remove('fa-bars', 'fa-caret-down');
                icon.classList.add('fa-times');
            } else {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
            this.classList.toggle('open', mobile.classList.contains('show'));
        }
        e.stopPropagation();
    });

    document.addEventListener('click', (e)=>{
        if (!mobile.contains(e.target) && !btn.contains(e.target)) {
            if (mobile.classList.contains('show')){
                mobile.classList.remove('show');
                btn.setAttribute('aria-expanded','false');
                mobile.setAttribute('aria-hidden','true');
            }
        }
    });

    const planRadios = document.querySelectorAll('input[name="plan"]');
    planRadios.forEach(radio => {
        radio.addEventListener('change', function(e) {
            togglePlan(this);
        });
    });

    const accordions = document.querySelectorAll('.accordion');
    accordions.forEach(ac => {
        const items = ac.querySelectorAll('.accordion-item');
        items.forEach(item => {
            const btn = item.querySelector('.accordion-toggle');
            if (!btn) return;
            btn.addEventListener('click', () => {

                items.forEach(i => {
                    if (i !== item) {
                        i.classList.remove('open');
                        const t = i.querySelector('.accordion-toggle');
                        if (t) t.setAttribute('aria-expanded', 'false');
                        const icon = i.querySelector('.accordion-icon');
                        if (icon) icon.textContent = '+';
                    }
                });

                const isOpen = item.classList.toggle('open');
                btn.setAttribute('aria-expanded', String(isOpen));
                const icon = item.querySelector('.accordion-icon');
                if (icon) icon.textContent = isOpen ? '–' : '+';
            });
        });
    });

    const mainImg = document.querySelector('.main-product-img');
    const prevBtn = document.querySelector('.prev');
    const nextBtn = document.querySelector('.next');
    const dots = document.querySelectorAll('.dot');

    const images = [
        'assets/Image_fx(14).png',
        'assets/pexels-pixabay-264950.png',
        'assets/pexels-rethaferguson-3059609.png',
        'assets/pexels-valeriya-1961782.png',
        'assets/pexels-pixabay-264870.png',
        'assets/pexels-pixabay-264950.png',
        'assets/pexels-rethaferguson-3059609.png',
        'assets/pexels-valeriya-1961782.png'
    ];

    let currentIndex = 0;

    function updateGallery() {
        mainImg.src = images[currentIndex];
        dots.forEach((dot, i) => {
            dot.classList.toggle('active', i === currentIndex);
        });
    }

    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            currentIndex = (currentIndex - 1 + images.length) % images.length;
            updateGallery();
        });
    }

    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            currentIndex = (currentIndex + 1) % images.length;
            updateGallery();
        });
    }

    dots.forEach((dot, i) => {
        dot.addEventListener('click', () => {
            currentIndex = i;
            updateGallery();
        });
    });

    updateGallery();


    const addCartBtn = document.querySelector('.btn-add-cart');
    if (addCartBtn) {
        addCartBtn.addEventListener('click', () => {
            const planRadio = document.querySelector('input[name="plan"]:checked');
            const plan = planRadio ? planRadio.value : 'single';
            let fragrance = '';
            if (plan === 'single') {
                const fragRadio = document.querySelector('input[name="fragrance-single"]:checked');
                fragrance = fragRadio ? fragRadio.value : 'original';
            } else {
                const frag1 = document.querySelector('input[name="fragrance-double-1"]:checked');
                const frag2 = document.querySelector('input[name="fragrance-double-2"]:checked');
                fragrance = (frag1 ? frag1.value : 'original') + ',' + (frag2 ? frag2.value : 'original');
            }
            const url = `#cart?plan=${plan}&fragrance=${fragrance}`;
            window.location.href = url;
        });
    }
});


function togglePlan(input) {
    const planContents = document.querySelectorAll('.plan-content');
    planContents.forEach(content => content.classList.remove('active'));
    
    const activeContent = document.querySelector(`[data-plan="${input.value}"]`);
    if (activeContent) {
        activeContent.classList.add('active');
    }
}
