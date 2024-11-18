document.addEventListener('DOMContentLoaded', function() {
    const currentPath = window.location.pathname;
    const navItems = document.querySelectorAll('.nav-item');

    navItems.forEach(function(item) {
        const link = item.querySelector('a');
        const href = link.getAttribute('href');

        if (currentPath === href) {
            item.classList.add('active');
        }
    });
});
