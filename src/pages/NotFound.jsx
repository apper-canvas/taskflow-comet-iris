import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import ApperIcon from '../components/ApperIcon'

const NotFound = () => {
  return (
    <div className="min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="glass-card p-8 sm:p-12 rounded-3xl"
        >
          {/* 404 Icon */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="w-20 h-20 sm:w-24 sm:h-24 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-3xl flex items-center justify-center mx-auto mb-6 sm:mb-8"
          >
            <ApperIcon name="AlertTriangle" className="w-10 h-10 sm:w-12 sm:h-12 text-white" />
          </motion.div>

          {/* 404 Text */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-6xl sm:text-8xl font-bold bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent mb-4 sm:mb-6"
          >
            404
          </motion.h1>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-xl sm:text-2xl font-semibold text-surface-900 dark:text-surface-100 mb-3 sm:mb-4"
          >
            Page Not Found
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="text-sm sm:text-base text-surface-600 dark:text-surface-400 mb-6 sm:mb-8"
          >
            The page you're looking for doesn't exist or has been moved. 
            Let's get you back on track with your tasks!
          </motion.p>

          {/* Back to Home Button */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <Link
              to="/"
              className="inline-flex items-center space-x-2 bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 text-white px-6 py-3 sm:px-8 sm:py-4 rounded-2xl font-medium transition-all duration-300 transform hover:scale-105 hover:shadow-lg"
            >
              <ApperIcon name="Home" className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="text-sm sm:text-base">Back to TaskFlow</span>
            </Link>
          </motion.div>

          {/* Additional Navigation */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="mt-6 sm:mt-8 pt-6 sm:pt-8 border-t border-surface-200/30 dark:border-surface-700/30"
          >
            <p className="text-xs sm:text-sm text-surface-500 dark:text-surface-500 mb-3 sm:mb-4">
              Need help? Try these popular sections:
            </p>
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 text-xs sm:text-sm">
              <Link
                to="/"
                className="text-surface-700 dark:text-surface-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
              >
                Task Dashboard
              </Link>
              <Link
                to="/"
                className="text-surface-700 dark:text-surface-300 hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
              >
                Project Management
              </Link>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}

export default NotFound