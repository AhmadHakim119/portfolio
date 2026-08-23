# Ahmad Hakim | Portfolio

A professional portfolio showcasing my work in artificial intelligence, machine learning, technical research, and full-stack software development.

[View Live Portfolio](https://ahmadhakim119.github.io/portfolio/) · [GitHub Profile](https://github.com/AhmadHakim119) · [LinkedIn](https://www.linkedin.com/in/ahmad-hakim-139563357)

## About

I am a Computer Science student at Effat University focused on building reliable AI systems and full-stack products.

My work spans machine-learning evaluation, adversarial robustness, multimodal AI, OCR, LLM applications, APIs, databases, and user-facing software. I am particularly interested in systems that expose their limitations instead of hiding them.

## Featured Projects

### MISRA-EDU

An instructor-facing assessment system for OCR extraction, rubric-based AI grading, multimodal evidence review, human overrides, and AI-instructor agreement evaluation.

Key capabilities:

- OCR and multimodal evidence processing
- Gemini-powered grading
- Versioned rubrics
- Human review and overrides
- AI-instructor agreement analysis
- FastAPI, SQLAlchemy, and MariaDB/MySQL backend

[View MISRA-EDU](https://github.com/AhmadHakim119/misra_edu)

### Medical Diagnosis Under Attack

A machine-learning study examining how eight classifiers respond to label-flipping data-poisoning attacks using 1.3 million synthetic patient records.

Key findings:

- Evaluated eight machine-learning classifiers
- Tested poisoning rates from 10% to 30%
- Reduced sparse dataset memory usage from approximately 220 GB to under 2 GB
- Identified disproportionate degradation among rare pathologies
- Compared Logistic Regression, XGBoost, Random Forest, SVM, KNN, SGD, Naive Bayes, and Decision Trees

[View the DDXPlus Study](https://github.com/AhmadHakim119/ML_Project_DDXPLUS)

### CineVault

A full-stack movie and television discovery platform powered by the TMDb API.

Features include:

- Movie and television search
- User authentication
- Ratings and favorites
- Comments and reviews
- User profiles
- Administrative features
- Responsive interface

Built with PHP, MySQL, JavaScript, Bootstrap, and the TMDb API.

[View CineVault](https://github.com/AhmadHakim119/CineVault)

## Additional Work

- [Networking](https://github.com/AhmadHakim119/Networking): Cisco networking, VLANs, routing, switching, subnetting, and CCNA labs
- [Machine Learning](https://github.com/AhmadHakim119/Machine_learning): Machine-learning coursework, experiments, and notebooks
- [Portfolio](https://github.com/AhmadHakim119/portfolio): Source code for this website

## Portfolio Features

- Responsive editorial layout
- Interactive Three.js hero
- Locally vendored Three.js modules
- Scroll-triggered content reveals
- Reduced-motion support
- Keyboard-accessible navigation
- Responsive touch targets
- Lazy-loaded project imagery
- Open Graph and SEO metadata
- Progressive enhancement for direct-file viewing
- No frontend framework or build process required

## Technology

- HTML5
- CSS3
- JavaScript
- Three.js
- Intersection Observer API
- WebGL
- GitHub Pages

## Performance

The portfolio was tested with Lighthouse using a mobile performance profile.

| Category | Score |
| --- | ---: |
| Performance | 97 |
| Accessibility | 100 |
| Best Practices | 100 |
| SEO | 100 |

Additional results:

- Largest Contentful Paint: 2.2 seconds
- Cumulative Layout Shift: 0
- Total Blocking Time: 130 milliseconds

Performance results can vary by device, connection, browser, and hosting environment.

## Run Locally

Clone the repository:

```bash
git clone https://github.com/AhmadHakim119/portfolio.git
cd portfolio
```

Start a local server:

```bash
python -m http.server 4173
```

Open the following address:

```text
http://127.0.0.1:4173/
```

Press `Ctrl+C` in the terminal to stop the server.

A local server is recommended because browsers restrict JavaScript modules when a website is opened directly through `file://`.

## Project Structure

```text
portfolio/
├── fonts/
├── images/
├── vendor/
│   ├── three.core.min.js
│   └── three.module.min.js
├── index.html
├── index.css
├── index.js
├── LICENSE.md
└── README.md
```

## Deployment

This website is designed for GitHub Pages.

To deploy it:

1. Open the repository on GitHub.
2. Go to **Settings → Pages**.
3. Select **Deploy from a branch**.
4. Select the `main` branch.
5. Select the `/ (root)` folder.
6. Save the configuration.

The live website will be available at:

```text
https://ahmadhakim119.github.io/portfolio/
```

## Contact

- Email: [ahmadramihakim1122@gmail.com](mailto:ahmadramihakim1122@gmail.com)
- GitHub: [AhmadHakim119](https://github.com/AhmadHakim119)
- LinkedIn: [Ahmad Hakim](https://www.linkedin.com/in/ahmad-hakim-139563357)

## Acknowledgements

The original version of this repository was based on the open-source [Developer Portfolio template by Nisar Hassan](https://github.com/nisarhassan12/portfolio-template). The current website has been comprehensively redesigned with new content, layouts, accessibility improvements, project presentation, and an interactive Three.js experience.

## License

This project is available under the terms included in [LICENSE.md](./LICENSE.md).
