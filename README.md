# Repo2Txt

Repo2Txt is a Next.js-based web application that allows users to download the contents of a GitHub repository as a single text file. This tool is particularly useful for training Language Learning Models (LLMs) on repository-specific content.

## Features

- Fetch and display the directory structure of any public GitHub repository
- Support for private repositories using GitHub Personal Access Tokens
- Filter files by extension
- Select specific files or entire directories for download
- Download selected files as a single concatenated text file
- Syntax highlighting for various programming languages
- Responsive design for both desktop and mobile use

## Getting Started

To run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Then open [http://localhost:3000](http://localhost:3000) in your browser to see the application.

## Usage

1. Enter a GitHub repository URL in the input field.
2. (Optional) Enter a GitHub Personal Access Token for private repositories or increased API rate limits.
3. Click "Fetch Directory Structure" to load the repository contents.
4. Use the file tree to select which files you want to include.
5. Filter files by extension using the checkboxes provided.
6. Click "Download into txt" to generate and download a single text file with the contents of all selected files.

## Development

The main application logic is located in `src/app/page.tsx`. The project uses Next.js with TypeScript and Tailwind CSS for styling.

## Contributing

Contributions to Repo2Txt are welcome! If you'd like to contribute, feel free to submit a pull request.

## Reporting Issues

If you encounter any problems or have ideas for new features, please [open an issue](https://github.com/ahkamboh/repo2txt/issues) on the GitHub repository.

## License

This project is licensed under the Creative Commons Attribution-NonCommercial 4.0 International License. This means you are free to share and adapt the material, under the following terms:

- Attribution — You must give appropriate credit, provide a link to the license, and indicate if changes were made.
- NonCommercial — You may not use the material for commercial purposes.

For more details, see the [LICENSE](LICENSE) file or visit [Creative Commons BY-NC 4.0](https://creativecommons.org/licenses/by-nc/4.0/).

Copyright (c) 2024 Ali Hamza Kamboh
