/*
  The "jump to section" chips (.section-chips): highlight the chip of the section on screen and keep
  it centred in the chip row (phones show only a few chips). Only the chip row is scrolled — never
  the page (scrollIntoView can break iOS momentum). Used by ProductSections.astro (catalog sections)
  and the guide page with sections (src/pages/[...lang]/guides/[slug].astro). Browser only.
*/
export function watchSectionChips(sectionSelector) {
  const track = document.querySelector('.section-chips__track');
  const chips = new Map([...document.querySelectorAll('.section-chip')].map((chip) => [chip.hash.slice(1), chip]));
  if (!chips.size) return;
  const setActive = (id) => {
    chips.forEach((chip, key) => {
      const active = key === id;
      if (active) chip.setAttribute('aria-current', 'true');
      else chip.removeAttribute('aria-current');
      if (active && track) {
        const left = chip.offsetLeft - (track.clientWidth - chip.offsetWidth) / 2;
        track.scrollTo({ left, behavior: 'smooth' });
      }
    });
  };
  const observer = new IntersectionObserver(
    (entries) => {
      const visible = entries.filter((e) => e.isIntersecting);
      if (visible.length) setActive(visible[0].target.id);
    },
    { rootMargin: '-35% 0px -60% 0px' } // the band just below the sticky bars
  );
  document.querySelectorAll(sectionSelector).forEach((s) => observer.observe(s));
}
