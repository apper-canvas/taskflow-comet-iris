import { useState } from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import MainFeature from '../components/MainFeature'
import ApperIcon from '../components/ApperIcon'

const Home = () => {
  const [darkMode, setDarkMode] = useState(false)

  const toggleDarkMode = () => {
    setDarkMode(!darkMode)
    document.documentElement.classList.toggle('dark')
  }

  return (
    <div className="min-h-screen">
      {/* Header */}
      <motion.header 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="sticky top-0 z-50 glass-card border-b border-surface-200/20"
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20">
            {/* Logo */}
            <motion.div 
              className="flex items-center space-x-3"
              whileHover={{ scale: 1.05 }}
            >
              <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-primary-500 to-primary-600 rounded-2xl flex items-center justify-center shadow-soft">
                <ApperIcon name="CheckSquare" className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-readable-primary">
                  TaskFlow
                </h1>
                <p className="text-xs sm:text-sm text-readable-secondary hidden sm:block">
                  Smart Task Management
                </p>
              </div>
            </motion.div>

            {/* Dark Mode Toggle */}
            <div className="flex items-center space-x-4">
              <Link
                to="/calendar"
                className="px-4 py-2 text-surface-readable hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
              >
                Calendar
              </Link>
              <Link
                to="/analytics"
                className="px-4 py-2 text-surface-readable hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
              >
                Analytics
              </Link>
              
            <motion.button
              onClick={toggleDarkMode}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="p-2 sm:p-3 rounded-xl bg-surface-100 dark:bg-surface-700 hover:bg-surface-200 dark:hover:bg-surface-600 transition-colors shadow-soft"
            >
              <ApperIcon 
                name={darkMode ? "Sun" : "Moon"} 
                className="w-5 h-5 sm:w-6 sm:h-6 text-surface-readable" 
              />
            </motion.button>
          </div>
          </div>
        </div>
      </motion.header>

      {/* Hero Section */}
      <motion.section 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="relative px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20"
      >
        <div className="container mx-auto text-center max-w-4xl">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-3xl sm:text-4xl lg:text-6xl font-bold text-readable-primary mb-4 sm:mb-6"
          >
            Organize Your
            <span className="block bg-gradient-to-r from-primary-500 via-secondary-500 to-accent-500 bg-clip-text text-transparent">
              Tasks & Projects
            </span>
          </motion.h2>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-lg sm:text-xl text-surface-readable mb-8 sm:mb-12 max-w-2xl mx-auto"
          >
            Effortlessly manage your tasks with our intuitive interface. 
            Create, organize, and track your progress with style.
          </motion.p>

          {/* Stats */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-8 mb-12 sm:mb-16"
          >
            {[
              { icon: "Target", label: "Tasks Completed", value: "2,547" },
              { icon: "Users", label: "Happy Users", value: "12K+" },
              { icon: "TrendingUp", label: "Productivity Boost", value: "85%" }
            ].map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.6 + index * 0.1 }}
                className="glass-card p-4 sm:p-6 rounded-2xl"
              >
                <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-2xl flex items-center justify-center mx-auto mb-3 sm:mb-4">
                  <ApperIcon name={stat.icon} className="w-6 h-6 sm:w-8 sm:h-8 text-white" />
                </div>
                <div className="text-2xl sm:text-3xl font-bold text-readable-primary mb-1 sm:mb-2">
                  {stat.value}
                </div>
                <div className="text-sm sm:text-base text-surface-readable">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </motion.section>

      {/* Main Feature */}
      <motion.section 
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="px-4 sm:px-6 lg:px-8 pb-16 sm:pb-20 lg:pb-24"
      >
        <MainFeature />
      </motion.section>

      {/* Footer */}
      <motion.footer 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
        className="glass-card border-t border-surface-200/20 py-8 sm:py-12"
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex items-center justify-center space-x-3 mb-4">
            <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-primary-600 rounded-xl flex items-center justify-center">
              <ApperIcon name="CheckSquare" className="w-4 h-4 text-white" />
            </div>
            <span className="text-lg font-semibold text-readable-primary">TaskFlow</span>
          </div>
          <p className="text-surface-readable text-sm sm:text-base">
            © 2024 TaskFlow. Built with passion for productivity.
          </p>
        </div>
      </motion.footer>
    </div>
  )
}

export default Home