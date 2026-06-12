document.documentElement.classList.add('js');

(function () {
    var navbar = document.querySelector('.navbar');
    if (!navbar) return;
    function onScroll() {
        navbar.classList.toggle('scrolled', window.scrollY > 8);
    }
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
})();

(function () {
    var path = window.location.pathname;
    document.querySelectorAll('.nav-link[href]').forEach(function (link) {
        var href = link.getAttribute('href');
        if (href === path || (href !== '/' && href.indexOf('http') !== 0 && path.startsWith(href))) {
            link.classList.add('active');
        }
    });
})();

(function () {
    var elements = document.querySelectorAll('.reveal');
    if (!elements.length) return;

    function show(el) { el.classList.add('is-visible'); }

    function inView(el) {
        var rect = el.getBoundingClientRect();
        return rect.top < window.innerHeight * 0.92 && rect.bottom > 0;
    }

    if ('IntersectionObserver' in window) {
        var observer = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    show(entry.target);
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.08, rootMargin: '0px 0px -30px 0px' });

        elements.forEach(function (el) {
            if (inView(el)) show(el);
            else observer.observe(el);
        });
    } else {
        elements.forEach(show);
    }
})();

(function () {
    var marquee = document.querySelector('.flow-marquee');
    if (!marquee) return;

    var track = marquee.querySelector('.flow-marquee-track');
    var sourceGroup = track && track.querySelector('.flow-marquee-group');
    if (!track || !sourceGroup) return;

    var seedHTML = sourceGroup.innerHTML;
    var reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var speed = 42;
    var resizeTimer;

    function trackGap() {
        return parseFloat(getComputedStyle(track).gap) || 0;
    }

    function buildMarquee() {
        track.querySelectorAll('.flow-marquee-group').forEach(function (group, index) {
            if (index > 0) group.remove();
        });
        sourceGroup.innerHTML = seedHTML;

        var baseCards = Array.prototype.slice.call(
            sourceGroup.querySelectorAll('.flow-marquee-card')
        );
        if (!baseCards.length) return;

        var minWidth = window.innerWidth * 1.2;
        while (sourceGroup.getBoundingClientRect().width < minWidth) {
            baseCards.forEach(function (card) {
                sourceGroup.appendChild(card.cloneNode(true));
            });
        }

        var mirror = sourceGroup.cloneNode(true);
        mirror.setAttribute('aria-hidden', 'true');
        track.appendChild(mirror);

        var shift = sourceGroup.getBoundingClientRect().width + trackGap();
        track.style.setProperty('--marquee-shift', '-' + shift + 'px');
        track.style.setProperty('--marquee-duration', (shift / speed) + 's');
        track.style.animation = reducedMotion ? 'none' : '';
    }

    buildMarquee();
    window.addEventListener('resize', function () {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(buildMarquee, 200);
    });
})();

(function () {
    var mapEl = document.getElementById('map');
    if (!mapEl) return;

    var map = L.map('map').setView([39.95, -75.16], 10);
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(map);

    L.circle([39.95, -75.16], {
        color: '#14b8a6',
        fillColor: '#14b8a6',
        fillOpacity: 0.18,
        radius: 5000
    }).addTo(map);
})();
