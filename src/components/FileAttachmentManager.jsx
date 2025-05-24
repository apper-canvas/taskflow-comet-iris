import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'react-toastify'
import ApperIcon from './ApperIcon'

const FileAttachmentManager = ({ taskId, attachments = [], onUpload, onDelete }) => {
  const [isDragOver, setIsDragOver] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [previewFile, setPreviewFile] = useState(null)
  const [showPreview, setShowPreview] = useState(false)
  const fileInputRef = useRef(null)

  const MAX_FILE_SIZE = 10 * 1024 * 1024 // 10MB
  const ALLOWED_TYPES = [
    'image/jpeg', 'image/png', 'image/gif', 'image/webp',
    'application/pdf', 'text/plain', 'text/csv',
    'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
  ]

  const validateFiles = (files) => {
    const validFiles = []
    const errors = []

    Array.from(files).forEach(file => {
      if (!ALLOWED_TYPES.includes(file.type)) {
        errors.push(`${file.name}: Unsupported file type`)
        return
      }
      
      if (file.size > MAX_FILE_SIZE) {
        errors.push(`${file.name}: File too large (max 10MB)`)
        return
      }
      
      validFiles.push(file)
    })

    if (errors.length > 0) {
      errors.forEach(error => toast.error(error))
    }

    return validFiles
  }

  const handleFileUpload = async (files) => {
    const validFiles = validateFiles(files)
    
    if (validFiles.length === 0) return

    setUploading(true)
    
    try {
      // Simulate upload process
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      onUpload(validFiles)
      toast.success(`Successfully uploaded ${validFiles.length} file(s)`)
    } catch (error) {
      toast.error('Failed to upload files')
    } finally {
      setUploading(false)
    }
  }

  const handleDragOver = (e) => {
    e.preventDefault()
    setIsDragOver(true)
  }

  const handleDragLeave = (e) => {
    e.preventDefault()
    setIsDragOver(false)
  }

  const handleDrop = (e) => {
    e.preventDefault()
    setIsDragOver(false)
    const files = e.dataTransfer.files
    handleFileUpload(files)
  }

  const handleFileInputChange = (e) => {
    const files = e.target.files
    if (files && files.length > 0) {
      handleFileUpload(files)
    }
    // Reset the input
    e.target.value = ''
  }

  const handleDeleteAttachment = (attachmentId, attachmentName) => {
    if (window.confirm(`Are you sure you want to delete "${attachmentName}"?`)) {
      onDelete(attachmentId)
      toast.success('Attachment deleted successfully')
    }
  }

  const handlePreviewFile = (attachment) => {
    setPreviewFile(attachment)
    setShowPreview(true)
  }

  const handleDownloadFile = (attachment) => {
    try {
      const url = URL.createObjectURL(attachment.file)
      const a = document.createElement('a')
      a.href = url
      a.download = attachment.name
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
      toast.success(`Downloaded ${attachment.name}`)
    } catch (error) {
      toast.error('Failed to download file')
    }
  }

  const getFileIcon = (fileType) => {
    if (fileType.startsWith('image/')) return 'Image'
    if (fileType === 'application/pdf') return 'FileText'
    if (fileType.includes('word')) return 'FileText'
    if (fileType.includes('excel') || fileType.includes('csv')) return 'FileSpreadsheet'
    return 'File'
  }

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const isImageFile = (fileType) => {
    return fileType.startsWith('image/')
  }

  const getImagePreviewUrl = (file) => {
    return URL.createObjectURL(file)
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h5 className="text-sm font-medium text-readable-primary">
          Attachments ({attachments.length})
        </h5>
        <motion.button
          onClick={() => fileInputRef.current?.click()}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          disabled={uploading}
          className="text-sm text-primary-600 hover:text-primary-700 font-medium transition-colors disabled:opacity-50"
        >
          {uploading ? 'Uploading...' : 'Add Files'}
        </motion.button>
      </div>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        multiple
        onChange={handleFileInputChange}
        className="hidden"
        accept=".jpg,.jpeg,.png,.gif,.webp,.pdf,.txt,.csv,.doc,.docx,.xls,.xlsx"
      />

      {/* Drop zone */}
      <motion.div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        whileHover={{ scale: 1.01 }}
        className={`
          relative border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all duration-300
          ${isDragOver 
            ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20' 
            : 'border-surface-300 dark:border-surface-600 hover:border-primary-400 hover:bg-surface-50 dark:hover:bg-surface-800'
          }
          ${uploading ? 'pointer-events-none opacity-50' : ''}
        `}
      >
        <div className="flex flex-col items-center space-y-2">
          <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
            isDragOver ? 'bg-primary-100 dark:bg-primary-900/40' : 'bg-surface-100 dark:bg-surface-700'
          }`}>
            <ApperIcon 
              name={uploading ? "Loader2" : "Upload"} 
              className={`w-5 h-5 ${
                uploading ? 'animate-spin text-primary-600' : 'text-surface-500'
              }`} 
            />
          </div>
          <div>
            <p className="text-sm font-medium text-readable-primary">
              {uploading ? 'Uploading files...' : 'Drop files here or click to browse'}
            </p>
            <p className="text-xs text-surface-muted mt-1">
              Support for images, PDF, docs, spreadsheets (max 10MB each)
            </p>
          </div>
        </div>
      </motion.div>

      {/* Attachments list */}
      {attachments.length > 0 && (
        <div className="space-y-2">
          <AnimatePresence>
            {attachments.map((attachment) => (
              <motion.div
                key={attachment.id}
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="flex items-center justify-between p-3 bg-surface-50 dark:bg-surface-800 rounded-lg border border-surface-200 dark:border-surface-700"
              >
                <div className="flex items-center space-x-3 flex-1 min-w-0">
                  {/* File preview/icon */}
                  <div className="flex-shrink-0">
                    {isImageFile(attachment.type) ? (
                      <div className="w-10 h-10 rounded-lg overflow-hidden bg-surface-200 dark:bg-surface-600">
                        <img
                          src={getImagePreviewUrl(attachment.file)}
                          alt={attachment.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ) : (
                      <div className="w-10 h-10 rounded-lg bg-surface-200 dark:bg-surface-600 flex items-center justify-center">
                        <ApperIcon 
                          name={getFileIcon(attachment.type)} 
                          className="w-5 h-5 text-surface-600 dark:text-surface-300" 
                        />
                      </div>
                    )}
                  </div>

                  {/* File info */}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-readable-primary truncate">
                      {attachment.name}
                    </p>
                    <p className="text-xs text-surface-muted">
                      {formatFileSize(attachment.size)} • {new Date(attachment.uploadedAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center space-x-1 flex-shrink-0">
                  {isImageFile(attachment.type) && (
                    <motion.button
                      onClick={() => handlePreviewFile(attachment)}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className="p-2 text-surface-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-all duration-200"
                      title="Preview"
                    >
                      <ApperIcon name="Eye" className="w-4 h-4" />
                    </motion.button>
                  )}
                  <motion.button
                    onClick={() => handleDownloadFile(attachment)}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="p-2 text-surface-500 hover:text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-lg transition-all duration-200"
                    title="Download"
                  >
                    <ApperIcon name="Download" className="w-4 h-4" />
                  </motion.button>
                  <motion.button
                    onClick={() => handleDeleteAttachment(attachment.id, attachment.name)}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="p-2 text-surface-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all duration-200"
                    title="Delete"
                  >
                    <ApperIcon name="Trash2" className="w-4 h-4" />
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* File preview modal */}
      <AnimatePresence>
        {showPreview && previewFile && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-75"
            onClick={() => setShowPreview(false)}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="relative max-w-4xl max-h-full bg-white dark:bg-surface-800 rounded-2xl overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b border-surface-200 dark:border-surface-700">
                <div>
                  <h3 className="text-lg font-semibold text-readable-primary">{previewFile.name}</h3>
                  <p className="text-sm text-surface-muted">{formatFileSize(previewFile.size)}</p>
                </div>
                <div className="flex items-center space-x-2">
                  <motion.button
                    onClick={() => handleDownloadFile(previewFile)}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="p-2 text-surface-500 hover:text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-lg transition-all duration-200"
                    title="Download"
                  >
                    <ApperIcon name="Download" className="w-5 h-5" />
                  </motion.button>
                  <motion.button
                    onClick={() => setShowPreview(false)}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="p-2 text-surface-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all duration-200"
                  >
                    <ApperIcon name="X" className="w-5 h-5" />
                  </motion.button>
                </div>
              </div>

              {/* Content */}
              <div className="p-4">
                {isImageFile(previewFile.type) ? (
                  <div className="flex justify-center">
                    <img
                      src={getImagePreviewUrl(previewFile.file)}
                      alt={previewFile.name}
                      className="max-w-full max-h-[70vh] object-contain rounded-lg"
                    />
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 bg-surface-100 dark:bg-surface-700 rounded-full flex items-center justify-center mx-auto mb-4">
                      <ApperIcon 
                        name={getFileIcon(previewFile.type)} 
                        className="w-8 h-8 text-surface-600 dark:text-surface-300" 
                      />
                    </div>
                    <p className="text-readable-primary font-medium mb-2">Preview not available</p>
                    <p className="text-surface-muted text-sm mb-4">
                      This file type cannot be previewed. You can download it to view the content.
                    </p>
                    <motion.button
                      onClick={() => handleDownloadFile(previewFile)}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 btn-text-primary px-6 py-3 rounded-xl font-medium transition-all duration-300"
                    >
                      Download File
                    </motion.button>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default FileAttachmentManager