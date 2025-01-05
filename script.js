document.addEventListener("DOMContentLoaded", () => {
    const headings = document.querySelectorAll("h2");
    const heroSection = document.querySelector(".hero");
    const toc = document.getElementById("table-of-contents");
    const tocList = document.createElement("ul");

    // Create and append the indicator
    const indicator = document.createElement('div');
    indicator.id = 'toc-indicator';
    toc.appendChild(indicator);

    let hasScrolledPastHero = false;
    let lastActiveIndex = -1;

    // Calculate indicator position
    const updateIndicator = () => {
        const links = document.querySelectorAll("#table-of-contents a");
        const linkRects = Array.from(links).map(link => link.getBoundingClientRect());
        const viewportHeight = window.innerHeight;
        
        // Find the active section
        let activeIndex = -1;
        for (let i = 0; i < headings.length; i++) {
            const rect = headings[i].getBoundingClientRect();
            if (rect.top <= viewportHeight / 2 && rect.bottom >= 0) {
                activeIndex = i;
                break;
            }
        }

        if (activeIndex !== -1 && activeIndex !== lastActiveIndex) {
            const activeLinkRect = linkRects[activeIndex];
            const nextLinkRect = linkRects[activeIndex + 1] || null;
            
            // Calculate indicator position and height
            const indicatorTop = activeLinkRect.top - toc.getBoundingClientRect().top;
            const indicatorHeight = nextLinkRect 
                ? nextLinkRect.top - activeLinkRect.top
                : activeLinkRect.height;

            // Update indicator position
            indicator.style.top = `${indicatorTop}px`;
            indicator.style.height = `${indicatorHeight}px`;
            
            lastActiveIndex = activeIndex;
        }
    };

    // Add scroll listener for fade effect
    window.addEventListener("scroll", () => {
        if (heroSection) {
            const heroBottom = heroSection.getBoundingClientRect().bottom;
            if (heroBottom <= 0) {
                hasScrolledPastHero = true;
                toc.classList.add("visible");
            } else if (hasScrolledPastHero) {
                // Keep visible if user has scrolled past hero before
                toc.classList.add("visible");
            } else {
                toc.classList.remove("visible");
            }
        }
    });

    // Dynamically populate ToC
    headings.forEach((heading, index) => {
        const id = `section-${index}`;
        heading.id = id;

        const listItem = document.createElement("li");
        const link = document.createElement("a");
        link.href = `#${id}`;
        link.textContent = heading.textContent;
        link.classList.add("inactive"); // Default to inactive
        listItem.appendChild(link);
        tocList.appendChild(listItem);
    });

    toc.appendChild(tocList);

    // Adjust scroll position when clicking ToC links
    toc.addEventListener("click", event => {
        if (event.target.tagName === "A") {
            event.preventDefault(); // Prevent default jump behavior
            const targetId = event.target.getAttribute("href").slice(1);
            const targetElement = document.getElementById(targetId);

            if (targetElement) {
                const yOffset = -10; // Adjust this offset to match your needs
                const yPosition = targetElement.getBoundingClientRect().top + window.pageYOffset + yOffset;
                window.scrollTo({ top: yPosition, behavior: "smooth" });
            }
        }
    });

    // Highlight active sections
    const updateToC = () => {
        const links = document.querySelectorAll("#table-of-contents a");
        let activeSections = [];

        headings.forEach(heading => {
            const rect = heading.getBoundingClientRect();
            if (rect.top >= 0 && rect.top <= window.innerHeight / 2) {
                activeSections.push(heading.id);
            }
        });

        links.forEach(link => {
            const linkId = link.getAttribute("href").slice(1);
            if (activeSections.includes(linkId)) {
                link.classList.add("active");
                link.classList.remove("inactive");
            } else {
                link.classList.add("inactive");
                link.classList.remove("active");
            }
        });
    };

    // Auto-scroll ToC on mobile
    let isUserScrolling = false;
    let scrollTimeout;

    const autoScrollToC = () => {
        if (window.innerWidth > 720) return; // Only for mobile
        
        const links = document.querySelectorAll("#table-of-contents a");
        const activeLink = Array.from(links).find(link => link.classList.contains("active"));
        
        if (activeLink && !isUserScrolling) {
            const toc = document.getElementById("table-of-contents");
            const tocRect = toc.getBoundingClientRect();
            const linkRect = activeLink.getBoundingClientRect();
            
            // Calculate scroll position to center the active link
            const scrollTo = linkRect.left - tocRect.left + linkRect.width/2 - tocRect.width/2;
            
            // iOS-compatible smooth scrolling
            const start = toc.scrollLeft;
            const change = scrollTo - start;
            const startTime = performance.now();
            const duration = 300; // milliseconds
            
            const animateScroll = (currentTime) => {
                const elapsed = currentTime - startTime;
                const progress = Math.min(elapsed / duration, 1);
                toc.scrollLeft = start + change * progress;
                
                if (progress < 1) {
                    requestAnimationFrame(animateScroll);
                }
            };
            
            requestAnimationFrame(animateScroll);
        }
    };

    // Detect user interaction with ToC
    toc.addEventListener('scroll', () => {
        isUserScrolling = true;
        clearTimeout(scrollTimeout);
        scrollTimeout = setTimeout(() => {
            isUserScrolling = false;
        }, 1000); // Reset after 1 second of inactivity
    });

    // Listen to scroll events
    window.addEventListener("scroll", () => {
        updateToC();
        updateIndicator();
        autoScrollToC();
    });

    // Initial position
    updateIndicator();
    autoScrollToC();
});



document.addEventListener("DOMContentLoaded", () => {
    const collapsibleHeaders = document.querySelectorAll(".collapsible-header");
    collapsibleHeaders.forEach(header => {
        header.addEventListener("click", () => {
            header.classList.toggle("expanded");
        });
    });
});
