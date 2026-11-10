# C++ Labs

A simple English study guide for first-year C++ students.

## Live site

[Open the guide](https://dozzka.github.io/CPP_LABS/)

The current lesson, **Lab 7: Functions and vectors**, builds one program in six steps. Each step has a short explanation, a complete C++ program with one gap, a hint, sample input, and expected output.

Students can fill a gap, check that specific answer, copy or download the full program, and mark a step as complete after running it in their own C++ compiler. The site does not compile or run C++. Progress is stored only in the current browser.

Both classroom subgroups use the same lesson. Teacher-only scripts and full solution files are not included in this repository.

## Run locally

Serve the repository root with any static HTTP server, for example:

```sh
python -m http.server 8000
```

Then open `http://localhost:8000/`.

## Publish

GitHub Pages publishes the root of the `main` branch. The site is buildless: HTML, CSS, JavaScript, and student downloads. All asset paths are relative so the site works under `/CPP_LABS/`.

## Content

- `index.html`: the complete lesson, including code and expected output.
- `assets/site.css`: responsive layout and print styles.
- `assets/site.js`: gap checking, copy/download controls, and browser-local progress.
- `downloads/`: student worksheet and incomplete practice programs.

The temperature range in this exercise, 18 to 26 inclusive, is an arbitrary rule for learning C++. It is not a health or safety recommendation.
