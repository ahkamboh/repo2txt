'use client'

import { useState } from 'react'
import { ChevronDown, ChevronRight, FileIcon, FolderIcon, Github, Download, CheckSquare, Square } from 'lucide-react'
import Prism from 'prismjs'
import 'prismjs/themes/prism.css'
import 'prismjs/components/prism-javascript'
import 'prismjs/components/prism-typescript'
import 'prismjs/components/prism-jsx'
import 'prismjs/components/prism-tsx'
import 'prismjs/components/prism-json'
import 'prismjs/components/prism-css'
import 'prismjs/components/prism-markdown'
import 'prismjs/components/prism-python'
import 'prismjs/components/prism-rust'
import 'prismjs/components/prism-go'
import 'prismjs/components/prism-java'
import 'prismjs/components/prism-bash'
import { ProfileSection } from '@/components/profile-section'

interface TreeItem {
  name: string
  path: string
  type: string
  children?: TreeItem[]
  content?: string
  sha?: string
}

const FileTreeItem = ({ 
  item,
  level = 0,
  onCheckChange,
  checkedFiles,
  onFileClick,
  selectedFile,
  initiallyOpen = false 
}: {
  item: TreeItem
  level?: number
  onCheckChange: (item: TreeItem, checked: boolean, isDirectory: boolean) => void
  checkedFiles: Set<string>
  onFileClick: (item: TreeItem) => void
  selectedFile: TreeItem | null
  initiallyOpen?: boolean
}) => {
  const [isOpen, setIsOpen] = useState(initiallyOpen)
  const isDirectory = item.type === 'dir'

  const getDirectoryCheckStatus = (dirItem: TreeItem) => {
    if (!dirItem.children?.length) return false
    
    let checkedCount = 0
    const checkChild = (child: TreeItem) => {
      if (child.type === 'dir') {
        if (child.children?.every(grandChild => 
          grandChild.type === 'dir' ? getDirectoryCheckStatus(grandChild) : checkedFiles.has(grandChild.path)
        )) {
          checkedCount++
        }
      } else if (checkedFiles.has(child.path)) {
        checkedCount++
      }
    }
    
    dirItem.children.forEach(checkChild)
    return checkedCount === dirItem.children.length
  }

  const isChecked = isDirectory ? getDirectoryCheckStatus(item) : checkedFiles.has(item.path)
  const isSelected = selectedFile?.path === item.path

  const handleCheckChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.stopPropagation()
    onCheckChange(item, e.target.checked, isDirectory)
  }

  return (
    <div className="select-none">
      <div 
        className={`flex items-center py-1 px-2 cursor-pointer rounded-md
          ${isSelected ? 'bg-blue-100 hover:bg-blue-200' : 'hover:bg-gray-100'}
          ${isChecked ? 'bg-blue-50' : ''}
          transition-colors duration-150
        `}
        style={{ paddingLeft: `${level * 20}px` }}
      >
        <input
          type="checkbox"
          checked={isChecked}
          onChange={handleCheckChange}
          className="mr-2"
          onClick={(e) => e.stopPropagation()}
        />
        <div 
          onClick={() => {
            if (isDirectory) {
              setIsOpen(!isOpen)
            } else {
              onFileClick(item)
            }
          }}
          className="flex items-center flex-1"
        >
          {isDirectory ? (
            <>
              {isOpen ? (
                <ChevronDown className="w-4 h-4 text-gray-500" />
              ) : (
                <ChevronRight className="w-4 h-4 text-gray-500" />
              )}
              <FolderIcon className="w-4 h-4 text-blue-500 ml-1 mr-2" />
            </>
          ) : (
            <FileIcon className="w-4 h-4 text-gray-500 ml-5 mr-2" />
          )}
          <span className="text-sm">{item.name}</span>
        </div>
      </div>
      {isDirectory && isOpen && item.children?.map((child) => (
        <FileTreeItem
          key={child.path}
          item={child}
          level={level + 1}
          onCheckChange={onCheckChange}
          checkedFiles={checkedFiles}
          onFileClick={onFileClick}
          selectedFile={selectedFile}
          initiallyOpen={initiallyOpen}
        />
      ))}
    </div>
  )
}

// Add this new component for detailed error messages
const ErrorMessage = ({ type }: { type: string }) => {
  const messages = {
    private: {
      icon: (
        <svg className="h-16 w-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
        </svg>
      ),
      title: "Private Repository Detected",
      description: "This repository is private. You have two options:",
      actions: [
        "1. Enter a Personal Access Token above to access it",
        "2. Make the repository public in GitHub settings"
      ]
    },
    invalid: {
      icon: (
        <svg className="h-16 w-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
      ),
      title: "Invalid Repository URL OR Private Repository",
      description: "We couldn't find this repository. Please check:",
      actions: [
        "1. The repository URL is correct",
        "OR",
        "2. If the repository is private, you have two options:",
        "● Enter a Personal Access Token above to access it",
        "● Make the repository public in GitHub settings",
        "3. The repository exists",
        "4. You have typed the URL in the correct format (github.com/owner/repo)"
      ]
    },
    network: {
      icon: (
        <svg className="h-16 w-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064" />
        </svg>
      ),
      title: "Connection Error OR Private Repository",
      description: "Unable to connect to GitHub. Please:",
      actions: [
        "1. Check your internet connection",
        "2. Try again in a few moments",
        "3. Verify GitHub is accessible",
        "OR",
        "4. If the repository is private, you have two options:",
        "● Enter a Personal Access Token above to access it",
        "● Make the repository public in GitHub settings",
        "5. The repository exists",
        "6. You have typed the URL in the correct format (github.com/owner/repo)"
      ]
    }
  };

  const message = messages[type as keyof typeof messages] || {
    icon: (
      <svg className="h-16 w-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
      </svg>
    ),
    title: "An Error Occurred OR Private Repository",
    description: "We encountered an unexpected error. Please try again.",
    actions: [  
      "1. Refresh the page",
      "2. Try again later",
      "3. Contact support if the problem persists",
      "OR",
      "4. If the repository is private, you have two options:",
      "● Enter a Personal Access Token above to access it",
      "● Make the repository public in GitHub settings",
      "5. The repository exists",
      "6. You have typed the URL in the correct format (github.com/owner/repo)"
    ]
  };

  return (
    <div className="flex flex-col items-center justify-center p-8 bg-gray-50 rounded-lg border border-gray-200 min-h-[300px]">
      {message.icon}
      <h3 className="text-xl font-semibold text-gray-900 mt-4 mb-2">
        {message.title}
      </h3>
      <p className="text-gray-600 text-center mb-4">
        {message.description}
      </p>
      <ul className="text-sm text-gray-600 space-y-2">
        {message.actions.map((action, index) => (
          <li key={index} className="flex items-center gap-2">
            <span>{action}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default function page() {
  const [repoUrl, setRepoUrl] = useState('')
  const [fileTree, setFileTree] = useState<TreeItem | null>(null)
  const [checkedFiles, setCheckedFiles] = useState(new Set<string>())
  const [extensions, setExtensions] = useState(new Set(['.js', '.jsx', '.ts', '.css']))
  const [selectedFileContent, setSelectedFileContent] = useState('')
  const [selectedFile, setSelectedFile] = useState<TreeItem | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isValidUrl, setIsValidUrl] = useState(false)
  const [githubToken, setGithubToken] = useState('')
  const [availableExtensions, setAvailableExtensions] = useState<Set<string>>(new Set());
  const [extensionCounts, setExtensionCounts] = useState<Record<string, number>>({});
  const [showToken, setShowToken] = useState(false);
  const [isTokenValid, setIsTokenValid] = useState(false);
  const [showTokenInfo, setShowTokenInfo] = useState(false);
  const [isPrivateRepo, setIsPrivateRepo] = useState(false);
  const [isInitiallyOpen, setIsInitiallyOpen] = useState(false);

  const fetchDirectoryContents = async (repoPath: string, path: string = '') => {
    try {
      const apiPath = path 
        ? `/repos/${repoPath}/contents/${path}`
        : `/repos/${repoPath}/contents`
      
      const response = await fetch('/api/github', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // Include authorization if token exists
          ...(githubToken && { 'Authorization': `token ${githubToken}` })
        },
        body: JSON.stringify({ 
          path: apiPath,
          token: githubToken // Pass token to API route
        })
      })
      
      const data = await response.json()
      if (data.message) {
        throw new Error(data.message)
      }
      return data
    } catch (error: any) {
      console.error('Error fetching contents:', error)
      if (error.message === 'Not Found' || error.message === '404: Not Found') {
        throw new Error('Repository not found or private. Please check the URL or provide a GitHub token.')
      }
      return []
    }
  }

  const fetchFileContent = async (repoPath: string, filePath: string) => {
    try {
      const apiPath = `/repos/${repoPath}/contents/${filePath}`
      
      const response = await fetch('/api/github', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ path: apiPath })
      })
      
      const data = await response.json()
      if (data.message) {
        throw new Error(data.message)
      }
      
      return atob(data.content)
    } catch (error) {
      console.error('Error fetching file content:', error)
      throw error
    }
  }

  const buildFileTree = async (repoPath: string, path: string = ''): Promise<TreeItem[]> => {
    const contents = await fetchDirectoryContents(repoPath, path)
    const items: TreeItem[] = []

    for (const item of contents) {
      if (item.type === 'dir') {
        const children = await buildFileTree(repoPath, item.path)
        items.push({
          name: item.name,
          path: item.path,
          type: item.type,
          children
        })
      } else {
        items.push({
          name: item.name,
          path: item.path,
          type: item.type,
          sha: item.sha
        })
      }
    }

    return items
  }

  const handleFetch = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const repoPath = repoUrl.replace('https://github.com/', '');
      
      // First check if repository exists and is accessible
      const response = await fetch('/api/github', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          path: `/repos/${repoPath}`,
          token: githubToken
        })
      });

      const data = await response.json();

      if (!response.ok) {
        // Handle different error cases
        if (response.status === 401 || response.status === 403) {
          setError('invalid or private');
          setFileTree(null);
          return;
        }
        if (response.status === 404) {
          setError('invalid or private');
          setFileTree(null);
          return;
        }
        throw new Error(data.message || 'Failed to fetch repository');
      }

      // If we get here, repository is accessible, try to get contents
      const items = await buildFileTree(repoPath);
      setFileTree({ name: '/', type: 'dir', path: '/', children: items });
      
      // Count files by extension
      const counts = countFilesByExtension(items);
      setExtensionCounts(counts);
      setAvailableExtensions(new Set(Object.keys(counts)));
      
      // Set initially open to true after successful fetch
      setIsInitiallyOpen(true);
    } catch (error) {
      console.error('Error fetching repository:', error);
      setError('network');
      setFileTree(null);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileClick = async (file: TreeItem) => {
    try {
      if (file.type === 'file') {
        setSelectedFile(file)
        setSelectedFileContent('Loading...')
        const repoPath = repoUrl.replace('https://github.com/', '')
        const content = await fetchFileContent(repoPath, file.path)
        setSelectedFileContent(content)
      }
    } catch (error) {
      console.error('Error fetching file content:', error)
      setSelectedFileContent('Error loading file content')
    }
  }

  const handleCheckChange = (item: TreeItem, checked: boolean, isDirectory: boolean) => {
    const newCheckedFiles = new Set(checkedFiles)
    
    const updateFileSelection = (currentItem: TreeItem) => {
      if (currentItem.type === 'file') {
        if (checked) {
          newCheckedFiles.add(currentItem.path)
        } else {
          newCheckedFiles.delete(currentItem.path)
        }
      }
      currentItem.children?.forEach(updateFileSelection)
    }

    updateFileSelection(item)
    setCheckedFiles(newCheckedFiles)
  }

  const handleExtensionToggle = (ext: string) => {
    const newExtensions = new Set(extensions)
    const newCheckedFiles = new Set(checkedFiles)
    
    if (newExtensions.has(ext)) {
      // Uncheck extension and remove all files with this extension
      newExtensions.delete(ext)
      Array.from(checkedFiles).forEach(filePath => {
        if (filePath.endsWith(ext)) {
          newCheckedFiles.delete(filePath)
        }
      })
    } else {
      // Check extension and add all files with this extension
      newExtensions.add(ext)
      const addFilesWithExtension = (items: TreeItem[]) => {
        items.forEach(item => {
          if (item.type === 'file' && item.name.endsWith(ext)) {
            newCheckedFiles.add(item.path)
          }
          if (item.children) {
            addFilesWithExtension(item.children)
          }
        })
      }
      
      if (fileTree?.children) {
        addFilesWithExtension(fileTree.children)
      }
    }
    
    setExtensions(newExtensions)
    setCheckedFiles(newCheckedFiles)
  }

  const downloadSelectedFiles = async () => {
    try {
      const repoPath = repoUrl.replace('https://github.com/', '')
      let combinedContent = ''
      let downloadCount = 0

      const progressDiv = document.createElement('div')
      progressDiv.style.position = 'fixed'
      progressDiv.style.top = '20px'
      progressDiv.style.right = '20px'
      progressDiv.style.padding = '10px'
      progressDiv.style.background = '#4a5568'
      progressDiv.style.color = 'white'
      progressDiv.style.borderRadius = '5px'
      document.body.appendChild(progressDiv)

      const sortedFiles = Array.from(checkedFiles).sort()
      const totalFiles = sortedFiles.length

      for (const filePath of sortedFiles) {
        try {
          downloadCount++
          progressDiv.textContent = `Downloading: ${downloadCount}/${totalFiles} files`

          const content = await fetchFileContent(repoPath, filePath)
          combinedContent += `\n// File: ${filePath}\n${content}\n`
          combinedContent += '\n' + '='.repeat(80) + '\n'
        } catch (error) {
          console.error(`Error fetching content for ${filePath}:`, error)
          combinedContent += `\n// Error loading file: ${filePath}\n`
        }
      }

      document.body.removeChild(progressDiv)

      if (combinedContent.trim() === '') {
        alert('Please select at least one file to download')
        return
      }

      const blob = new Blob([combinedContent], { type: 'text/plain' })
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `github-files-${new Date().toISOString().slice(0, 10)}.txt`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      window.URL.revokeObjectURL(url)

    } catch (error) {
      console.error('Error downloading files:', error)
      alert('Error downloading files. Please try again.')
    }
  }

  const hasSelectedFiles = () => {
    return checkedFiles.size > 0
  }

  const handleCheckAll = () => {
    const newCheckedFiles = new Set<string>()
    
    const addAllFiles = (item: TreeItem) => {
      if (item.type === 'file') {
        newCheckedFiles.add(item.path)
      }
      item.children?.forEach(addAllFiles)
    }

    if (fileTree) {
      addAllFiles(fileTree)
    }
    
    setCheckedFiles(newCheckedFiles)
  }

  const handleUncheckAll = () => {
    setCheckedFiles(new Set())
  }

  const getLanguageFromFileName = (fileName: string): string => {
    const extension = fileName.split('.').pop()?.toLowerCase()
    const languageMap: { [key: string]: string } = {
      'js': 'javascript',
      'jsx': 'javascript',
      'mjs': 'javascript',
      'cjs': 'javascript',
      'ts': 'typescript',
      'tsx': 'typescript',
      'html': 'html',
      'css': 'css',
      'scss': 'scss',
      'less': 'less',
      'json': 'json',
      'yaml': 'yaml',
      'yml': 'yaml',
      'toml': 'toml',
      'md': 'markdown',
      'mdx': 'markdown',
      'txt': 'plaintext',
      'py': 'python',
      'rb': 'ruby',
      'rs': 'rust',
      'go': 'go',
      'java': 'java',
      'php': 'php',
      'c': 'c',
      'cpp': 'cpp',
      'cs': 'csharp',
      'swift': 'swift',
      'kt': 'kotlin',
      'sh': 'bash',
      'bash': 'bash',
      'zsh': 'bash',
      'fish': 'bash',
      'dockerfile': 'dockerfile',
      'env': 'plaintext',
      'ini': 'ini',
      'conf': 'plaintext',
      'gitignore': 'plaintext',
      'gitattributes': 'plaintext'
    }

    return languageMap[extension || ''] || 'plaintext'
  }

  const formatCode = (content: string, fileName: string) => {
    if (!content) return ''
    const language = getLanguageFromFileName(fileName)
    
    try {
      if (!Prism.languages[language]) {
        return Prism.highlight(
          content,
          Prism.languages.plaintext,
          'plaintext'
        )
      }
      
      return Prism.highlight(
        content,
        Prism.languages[language],
        language
      )
    } catch (error) {
      console.error('Error highlighting code:', error)
      return content
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
    }
  }

  const getFileTypeLabel = (fileName: string): string => {
    const language = getLanguageFromFileName(fileName)
    return language.charAt(0).toUpperCase() + language.slice(1)
  }

  const validateGitHubUrl = (url: string) => {
    const githubUrlPattern = /^https?:\/\/github\.com\/[\w-]+\/[\w.-]+\/?$/
    return  githubUrlPattern.test(url)
  }

  const handleUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const url = e.target.value
    setRepoUrl(url)
    
    if (!url) {
      setError(null)
      setIsValidUrl(false)
      return
    }

    if (!url.startsWith('https://github.com/')) {
      setError('Please enter a valid GitHub repository URL')
      setIsValidUrl(false)
      return
    }

    if (!validateGitHubUrl(url)) {
      setError('Invalid GitHub URL format. Example: https://github.com/username/repository')
      setIsValidUrl(false)
      return
    }

    setError(null)
    setIsValidUrl(true)
  }

  // Function to extract unique extensions from file tree
  const extractExtensions = (items: TreeItem[]) => {
    const extensions = new Set<string>();
    
    const processItem = (item: TreeItem) => {
      if (item.type === 'file') {
        const ext = '.' + item.name.split('.').pop()?.toLowerCase();
        if (ext !== '.') {
          extensions.add(ext);
        }
      }
      item.children?.forEach(processItem);
    };

    items.forEach(processItem);
    return extensions;
  };

  // Function to count files by extension
  const countFilesByExtension = (items: TreeItem[]) => {
    const counts: Record<string, number> = {};
    
    const processItem = (item: TreeItem) => {
      if (item.type === 'file') {
        const ext = '.' + item.name.split('.').pop()?.toLowerCase();
        if (ext !== '.') {
          counts[ext] = (counts[ext] || 0) + 1;
        }
      }
      item.children?.forEach(processItem);
    };

    items.forEach(processItem);
    return counts;
  };

  // Token validation function
  const validateToken = (token: string) => {
    return token.startsWith('ghp_') && token.length === 40;
  };

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-8 mt-5 relative">
      <div className='absolute sm:top-0 -top-2  sm:scale-100 scale-[.65] right-2'>
        <ProfileSection />
      </div>
      <h1 className="text-4xl flex justify-center w-full font-bold text-center mb-8">
        <img src="https://i0.wp.com/mattruma.com/wp-content/uploads/2019/04/528389819366_e7a0672f0480b3e98d21_512.png" alt="Repo to TXT" className="h-12 " />
         <span className='pt-1'>Repo to TXT</span>
      </h1>
      <p className="text-base font-bold text-center mb-8">Download text file to train your LLM for repository-specific conversations</p>
      <div className="bg-white shadow-md rounded-lg p-6">
        <label className="block text-sm font-medium mb-2">GitHub Repository URL:</label>
        <div className="relative">
          <input
            type="text"
            value={repoUrl}
            onChange={handleUrlChange}
            placeholder="https://github.com/username/repository"
            className={`w-full p-3 border rounded-md pr-10 ${
              error ? 'border-red-500' : isValidUrl ? 'border-green-500' : 'border-gray-300'
            } focus:outline-none focus:ring-2 focus:ring-blue-500`}
          />
          {isValidUrl && (
            <div className="absolute right-3 top-1/2  transform -translate-y-1/2">
              <svg
                className="w-5 h-5 text-green-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
          )}
        </div>
        {error && (
          <div className="mt-2 text-sm text-red-500 flex items-center">
            <svg
              className="w-4 h-4 mr-1"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                clipRule="evenodd"
              />
            </svg>
            {error}
          </div>
        )}

        <button
          onClick={handleFetch}
          disabled={!isValidUrl || isLoading}
          className={`mt-4 w-full py-3 px-4 rounded-md font-medium transition-colors flex items-center justify-center ${
            !isValidUrl || isLoading
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-blue-500 text-white hover:bg-blue-600'
          }`}
        >
          {isLoading ? (
            <>
              <div className="animate-spin mr-2 h-5 w-5 border-2 border-white border-t-transparent rounded-full"></div>
              Loading...
            </>
          ) : (
            <>
              <Github className="w-5 h-5 mr-2" />
              Fetch Directory Structure
            </>
          )}
        </button>

        <div className="space-y-2 pt-3">
          <div className="flex items-center gap-2">
            <label className="block text-sm font-medium text-gray-700">
              Personal Access Token
              <span className="ml-1 text-gray-400">(optional)</span>
            </label>
            
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowTokenInfo(!showTokenInfo)}
                className="text-gray-400 hover:text-gray-600 focus:outline-none"
                aria-label="Token information"
              >
                <svg 
                  className="w-5 h-5" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" 
                  />
                </svg>
              </button>

              {/* Replace the tooltip with a centered modal */}
              {showTokenInfo && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                  <div className="bg-white rounded-lg p-6 max-w-lg w-full mx-4">
                    <div className="flex justify-between items-start mb-4">
                      <h4 className="font-medium text-gray-900 text-lg">About Personal Access Tokens</h4>
                      <button 
                        onClick={() => setShowTokenInfo(false)}
                        className="text-gray-400 hover:text-gray-600"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                    
                    <ul className="text-sm text-gray-600 space-y-2 list-disc list-inside mb-4">
                      <li>Required for accessing private repositories</li>
                      <li>Provides higher API rate limits (5000 vs 60 requests/hour)</li>
                      <li>Enables additional GitHub API features</li>
                    </ul>

                    <div className="border-t border-gray-100 pt-4">
                      <p className="text-sm text-gray-700 font-medium mb-2">
                        To generate a token:
                      </p>
                      <ol className="text-sm text-gray-600 list-decimal list-inside space-y-2">
                        <li>Go to GitHub Settings → Developer settings</li>
                        <li>Select "Personal access tokens" → "Tokens (classic)"</li>
                        <li>Click "Generate new token"</li>
                        <li>Select "repo" scope for full repository access</li>
                      </ol>
                    </div>

                    <div className="mt-6 flex justify-between items-center">
                      <a
                        href="https://github.com/settings/tokens"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center text-sm text-blue-600 hover:text-blue-800"
                      >
                        Generate token
                        <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                        </svg>
                      </a>
                      <button
                        onClick={() => setShowTokenInfo(false)}
                        className="px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
                      >
                        Close
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
          
          <div className="relative">
            <input
              type={showToken ? "text" : "password"}
              value={githubToken}
              onChange={(e) => {
                const newToken = e.target.value;
                setGithubToken(newToken);
                setIsTokenValid(validateToken(newToken));
              }}
              placeholder="ghp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
              className={`w-full px-4 py-2 pr-24 border rounded-lg focus:ring-2 focus:outline-none transition-colors
                ${isTokenValid 
                  ? 'border-green-300 focus:border-green-400 focus:ring-green-200' 
                  : 'border-gray-300 focus:border-blue-400 focus:ring-blue-200'
                }
                ${githubToken && !isTokenValid ? 'border-red-300' : ''}
              `}
            />
            <button
              type="button"
              onClick={() => setShowToken(!showToken)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              {showToken ? (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              )}
            </button>
          </div>

          {/* Helper text */}
          <div className="flex items-start space-x-2 text-sm">
            <div className="flex-shrink-0 mt-0.5">
              {githubToken && (
                isTokenValid ? (
                  <svg className="w-4 h-4 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  <svg className="w-4 h-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                )
              )}
            </div>
            <p className={`${
              !githubToken ? 'text-gray-500' :
              isTokenValid ? 'text-green-600' :
              'text-red-600'
            }`}>
              {!githubToken 
                ? 'Required for private repositories and higher rate limits'
                : isTokenValid 
                  ? 'Valid token format'
                  : 'Token should start with "ghp_" and be 40 characters long'
              }
            </p>
          </div>
        </div>
      </div>
      {fileTree && (
      <div className="bg-white shadow-md rounded-lg p-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Filter by file extensions:
        </label>
        <div className="flex flex-wrap gap-2">
          {Array.from(availableExtensions).sort().map((ext) => (
            <label
              key={ext}
              className={`inline-flex items-center px-3 py-1.5 rounded-lg border cursor-pointer
                ${extensions.has(ext) 
                  ? 'bg-blue-50 border-blue-300 text-blue-700' 
                  : 'bg-white border-gray-300 hover:bg-gray-50'
                } transition-colors duration-150`}
            >
              <input
                type="checkbox"
                checked={extensions.has(ext)}
                onChange={() => handleExtensionToggle(ext)}
                className="sr-only"
              />
              <span className="font-medium">{ext}</span>
              <span className={`ml-2 text-xs rounded-full px-2 py-0.5
                ${extensions.has(ext) 
                  ? 'bg-blue-100 text-blue-800' 
                  : 'bg-gray-100 text-gray-600'
                }`}
              >
                {extensionCounts[ext] || 0}
              </span>
            </label>
          ))}
        </div>
      </div>
      )}

      {fileTree && (
        <div className="flex gap-2 mb-4">
          <button
            onClick={handleCheckAll}
            className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600 transition-colors flex items-center"
          >
            <CheckSquare className="w-4 h-4 mr-2" />
            Check All
          </button>
          <button
            onClick={handleUncheckAll}
            className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600 transition-colors flex items-center"
          >
            <Square className="w-4 h-4 mr-2" />
            Uncheck All
          </button>
        
        <button 
          onClick={downloadSelectedFiles}
          disabled={!hasSelectedFiles()}
          className={`py-3 px-6 rounded-md font-medium transition-colors flex items-center ${
            hasSelectedFiles() 
              ? 'bg-emerald-500 text-white hover:bg-emerald-600' 
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          <Download className="w-5 h-5 mr-2" />
          {hasSelectedFiles() 
            ? `Download into txt (${checkedFiles.size})` 
            : 'Select Files to Download'}
          </button>
        </div>
      )}
    {hasSelectedFiles() && (
        <div className="mt-6 bg-white shadow-md rounded-lg p-6">
          <h3 className="font-medium mb-4">Selected Files ({checkedFiles.size}):</h3>
          <ul className="text-sm text-gray-600 max-h-40 overflow-y-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
            {Array.from(checkedFiles).map(file => (
              <li key={file} className="truncate">
                <FileIcon className="w-4 h-4 inline-block mr-2 text-gray-400" />
                {file}
              </li>
            ))}
          </ul>
        </div>
      )}
       {fileTree && (
      <div className="grid md:grid-cols-2 gap-6 sticky top-1">
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <div className="p-4 bg-gray-50 border-b font-medium ">File Structure</div>
          <div className="p-4 overflow-auto max-h-[600px]">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center h-[400px] space-y-4">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
                <p className="text-gray-500">Loading directory structure...</p>
              </div>
            ) : fileTree ? (
              <FileTreeItem 
                item={fileTree} 
                onCheckChange={handleCheckChange}
                checkedFiles={checkedFiles}
                onFileClick={handleFileClick}
                selectedFile={selectedFile}
                initiallyOpen={isInitiallyOpen}
              />
            ) : (
              <div className="flex items-center justify-center h-[400px] text-gray-500">
                Enter a GitHub URL and click "Fetch Directory Structure"
              </div>
            )}
          </div>
        </div>
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <div className="p-4 bg-gray-50 border-b flex items-center justify-between">
            {selectedFile ? (
              <>
                <div className="flex items-center">
                  <FileIcon className="w-4 h-4 text-gray-500 mr-2" />
                  <span className="font-medium">{selectedFile.name}</span>
                </div>
                <span className="text-xs text-gray-500 px-2 py-1 bg-gray-200 rounded-full">
                  {getFileTypeLabel(selectedFile.name)}
                </span>
              </>
            ) : (
              <span className="text-gray-500">Select a file to view its content</span>
            )}
          </div>
          <div className="p-4 overflow-auto max-h-[560px] bg-gray-50">
            {selectedFileContent === 'Loading...' ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
              </div>
            ) : (
              <pre className="text-sm">
                <code 
                  className={`language-${selectedFile ? getLanguageFromFileName(selectedFile.name) : 'plaintext'}`}
                  dangerouslySetInnerHTML={{
                    __html: selectedFile 
                      ? formatCode(selectedFileContent, selectedFile.name)
                      : 'No content to display'
                  }}
                />
              </pre>
            )}
          </div>
        </div>
      </div>
      )}

      {error && <ErrorMessage type={error} />}

      {/* New section for reporting issues */}
      <div className="mt-12 border-t pt-8">
        <div className="text-center">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Have an issue or feature request?
          </h3>
          <p className="text-gray-600 mb-4">
            I am constantly improving. Let me know if you encounter any problems or have ideas for new features.
          </p>
          <a
            href="https://github.com/ahkamboh/repo2txt/issues"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <Github className="w-5 h-5 mr-2" />
            Report an Issue on GitHub
          </a>
        </div>
      </div>
    </div>
  )
}
