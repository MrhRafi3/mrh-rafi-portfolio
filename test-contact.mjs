import { chromium } from 'playwright';

const viewports = [
  { name: '1440-desktop', width: 1440, height: 900 },
  { name: '1280-laptop', width: 1280, height: 800 },
  { name: '768-tablet', width: 768, height: 1024 },
  { name: '390-mobile', width: 390, height: 844 },
  { name: '320-small-mobile', width: 320, height: 600 },
];

async function run() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    permissions: ['clipboard-read', 'clipboard-write'],
  });

  for (const vp of viewports) {
    console.log(`\n=================== Testing ${vp.name} (${vp.width}x${vp.height}) ===================`);
    const page = await context.newPage();
    await page.setViewportSize({ width: vp.width, height: vp.height });

    await page.goto('http://localhost:4173/', { waitUntil: 'networkidle' });

    // Scroll to contact scene by scrolling to bottom
    await page.evaluate(async () => {
      const track = document.querySelector('.cinematic-master-track');
      const maxScroll = (track ? track.scrollHeight : document.body.scrollHeight) - window.innerHeight;
      window.scrollTo(0, maxScroll);
    });

    await page.waitForTimeout(1000);

    // Verify contact section visibility and computed styles
    const contactData = await page.evaluate(() => {
      const section = document.querySelector('.contact-section');
      const card = document.querySelector('.contact-email-card');
      const email = document.querySelector('.contact-email-address');
      const copyBtn = document.querySelector('.contact-copy-btn');
      const ctaBtn = document.querySelector('.contact-cta-btn');
      const socialRow = document.querySelector('.contact-social-row');
      const socialLinks = document.querySelectorAll('.contact-social-pill');
      const footer = document.querySelector('.contact-footer');
      const backToTop = document.querySelector('.contact-back-to-top');

      function getBox(el) {
        if (!el) return null;
        const rect = el.getBoundingClientRect();
        const cs = window.getComputedStyle(el);
        return {
          tag: el.tagName,
          display: cs.display,
          flexDirection: cs.flexDirection,
          width: rect.width,
          height: rect.height,
          top: rect.top,
          left: rect.left,
          background: cs.backgroundColor,
          border: cs.border,
          borderRadius: cs.borderRadius,
          padding: cs.padding,
          color: cs.color,
          fontSize: cs.fontSize,
          appearance: cs.appearance,
        };
      }

      return {
        sectionFound: !!section,
        cardBox: getBox(card),
        emailBox: getBox(email),
        copyBtnBox: getBox(copyBtn),
        ctaBtnBox: getBox(ctaBtn),
        socialRowBox: getBox(socialRow),
        socialCount: socialLinks.length,
        footerBox: getBox(footer),
        backToTopBox: getBox(backToTop),
        emailHref: email ? email.getAttribute('href') : null,
        ctaHref: ctaBtn ? ctaBtn.getAttribute('href') : null,
        linkedinHref: socialLinks[0] ? socialLinks[0].getAttribute('href') : null,
        githubHref: socialLinks[1] ? socialLinks[1].getAttribute('href') : null,
      };
    });

    console.log('DOM Evaluation:', JSON.stringify(contactData, null, 2));

    // Test clipboard copy on the 1440 desktop viewport
    if (vp.name === '1440-desktop') {
      const copyBtn = page.locator('.contact-copy-btn');
      await copyBtn.click();
      await page.waitForTimeout(200);
      const copyText = await copyBtn.innerText();
      console.log('Copy button text after click:', copyText);
      const isCopied = await copyBtn.evaluate((el) => el.classList.contains('is-copied'));
      console.log('Has is-copied class:', isCopied);
    }

    // Take a screenshot of the Contact section
    const screenshotPath = `/Users/rafi/.gemini/antigravity/brain/630429b4-650a-42c0-af61-fdb14d2bcc35/scratch/contact-${vp.name}.png`;
    const contactSection = page.locator('.contact-section');
    if (await contactSection.isVisible()) {
      await contactSection.screenshot({ path: screenshotPath });
      console.log(`Saved screenshot to ${screenshotPath}`);
    } else {
      await page.screenshot({ path: screenshotPath });
      console.log(`Saved full page screenshot to ${screenshotPath}`);
    }

    await page.close();
  }

  await browser.close();
  console.log('\nAll viewport tests completed!');
}

run().catch(console.error);
