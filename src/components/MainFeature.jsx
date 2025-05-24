import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { toast } from 'react-toastify'
import { Link } from 'react-router-dom'
import { format, isValid } from 'date-fns'
import ApperIcon from './ApperIcon'

const MainFeature = () => {
  const [tasks, setTasks] = useState([
    {
      id: '1',
      title: 'Design new landing page',
      description: 'Create a modern and responsive landing page for the new product launch',
      priority: 'high',
      status: 'in-progress',
      dueDate: '2024-01-15',
      projectId: 'proj-1',
      tags: ['design', 'frontend'],
      createdAt: new Date().toISOString(),
      timeEntries: [
        { id: 'time1', hours: 3, date: format(new Date(), 'yyyy-MM-dd'), description: 'Initial design work' },
        { id: 'time2', hours: 2, date: format(new Date(), 'yyyy-MM-dd'), description: 'Refinements' }
      ]
    },
    {
      id: '2',
      title: 'Review marketing campaign',
      description: 'Analyze the performance of Q4 marketing campaigns and prepare insights',
      priority: 'medium',
      status: 'pending',
      dueDate: '2024-01-20',
      projectId: 'proj-2',
      tags: ['marketing', 'analysis'],
      createdAt: new Date().toISOString(),
      timeEntries: [
        { id: 'time3', hours: 4, date: format(new Date(), 'yyyy-MM-dd'), description: 'Campaign analysis' }
      ]
    }
  ])

  const [projects] = useState([
    { id: 'proj-1', name: 'Website Redesign', color: '#6366f1' },
    { id: 'proj-2', name: 'Marketing Campaign', color: '#f59e0b' },
    { id: 'proj-3', name: 'Mobile App', color: '#10b981' }
  ])

  const [showTaskForm, setShowTaskForm] = useState(false)
  const [editingTask, setEditingTask] = useState(null)
  const [activeFilter, setActiveFilter] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [showTimeForm, setShowTimeForm] = useState(false)
  const [selectedTaskForTime, setSelectedTaskForTime] = useState(null)
  const [editingTimeEntry, setEditingTimeEntry] = useState(null)

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    priority: 'medium',
    dueDate: '',
    projectId: '',
    tags: ''
  })

  const [timeFormData, setTimeFormData] = useState({
    hours: '',
    date: format(new Date(), 'yyyy-MM-dd'),
    description: ''
  })

  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      priority: 'medium',
      dueDate: '',
      projectId: '',
      tags: ''
    })
    setEditingTask(null)
    setShowTaskForm(false)
  }

  const resetTimeForm = () => {
    setTimeFormData({
      hours: '',
      date: format(new Date(), 'yyyy-MM-dd'),
      description: ''
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    
    if (!formData.title.trim()) {
      toast.error('Please enter a task title')
      return
    }

    const taskData = {
      ...formData,
      id: editingTask ? editingTask.id : Date.now().toString(),
      status: editingTask ? editingTask.status : 'pending',
      tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
      createdAt: editingTask ? editingTask.createdAt : new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      timeEntries: editingTask ? editingTask.timeEntries : []
    }

    if (editingTask) {
      setTasks(prev => prev.map(task => task.id === editingTask.id ? taskData : task))
      toast.success('Task updated successfully!')
    } else {
      setTasks(prev => [...prev, taskData])
      toast.success('Task created successfully!')
    }

    resetForm()
  }

  const handleEdit = (task) => {
    setEditingTask(task)
    setFormData({
      title: task.title,
      description: task.description,
      priority: task.priority,
      dueDate: task.dueDate,
      projectId: task.projectId,
      tags: task.tags.join(', ')
    })
    setShowTaskForm(true)
  }

  const handleDelete = (taskId) => {
    setTasks(prev => prev.filter(task => task.id !== taskId))
    toast.success('Task deleted successfully!')
  }

  const toggleTaskStatus = (taskId) => {
    setTasks(prev => prev.map(task => {
      if (task.id === taskId) {
        const newStatus = task.status === 'completed' ? 'pending' : 'completed'
        toast.success(`Task marked as ${newStatus}!`)
        return { ...task, status: newStatus, updatedAt: new Date().toISOString() }
      }
      return task
    }))
  }

  const handleTimeSubmit = (e) => {
    e.preventDefault()
    
    if (!timeFormData.hours || !timeFormData.date) {
      toast.error('Please fill in all required fields')
      return
    }

    if (isNaN(timeFormData.hours) || parseFloat(timeFormData.hours) <= 0) {
      toast.error('Please enter a valid number of hours')
      return
    }

    const timeEntry = {
      id: editingTimeEntry ? editingTimeEntry.id : Date.now().toString(),
      hours: parseFloat(timeFormData.hours),
      date: timeFormData.date,
      description: timeFormData.description || ''
    }

    setTasks(prev => prev.map(task => {
      if (task.id === selectedTaskForTime) {
        const timeEntries = task.timeEntries || []
        let updatedEntries
        
        if (editingTimeEntry) {
          updatedEntries = timeEntries.map(entry => 
            entry.id === editingTimeEntry.id ? timeEntry : entry
          )
          toast.success('Time entry updated successfully!')
        } else {
          updatedEntries = [...timeEntries, timeEntry]
          toast.success('Time entry added successfully!')
        }
        
        return { ...task, timeEntries: updatedEntries }
      }
      return task
    }))

    resetTimeForm()
    setShowTimeForm(false)
    setEditingTimeEntry(null)
  }

  const handleEditTimeEntry = (taskId, timeEntry) => {
    setSelectedTaskForTime(taskId)
    setEditingTimeEntry(timeEntry)
    setTimeFormData({
      hours: timeEntry.hours.toString(),
      date: timeEntry.date,
      description: timeEntry.description
    })
    setShowTimeForm(true)
  }

  const handleDeleteTimeEntry = (taskId, timeEntryId) => {
    setTasks(prev => prev.map(task => {
      if (task.id === taskId) {
        const updatedEntries = (task.timeEntries || []).filter(entry => entry.id !== timeEntryId)
        toast.success('Time entry deleted successfully!')
        return { ...task, timeEntries: updatedEntries }
      }
      return task
    }))
  }

  const handleAddTime = (taskId) => {
    setSelectedTaskForTime(taskId)
    setEditingTimeEntry(null)
    resetTimeForm()
    setShowTimeForm(true)
  }

  const getTotalTimeForTask = (task) => {
    return (task.timeEntries || []).reduce((total, entry) => total + entry.hours, 0)
  }

  const closeTimeForm = () => {
    setShowTimeForm(false)
    setSelectedTaskForTime(null)
    setEditingTimeEntry(null)
    resetTimeForm()
  }

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high': return 'text-red-600 bg-red-50 border-red-200'
      case 'medium': return 'text-yellow-600 bg-yellow-50 border-yellow-200'
      case 'low': return 'text-green-600 bg-green-50 border-green-200'
      default: return 'text-gray-600 bg-gray-50 border-gray-200'
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed': return 'CheckCircle'
      case 'in-progress': return 'Clock'
      default: return 'Circle'
    }
  }

  const filteredTasks = useMemo(() => {
    return tasks.filter(task => {
      const matchesFilter = activeFilter === 'all' || task.status === activeFilter
      const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           task.description.toLowerCase().includes(searchQuery.toLowerCase())
      return matchesFilter && matchesSearch
    })
  }, [tasks, activeFilter, searchQuery])

  const getProjectName = (projectId) => {
    const project = projects.find(p => p.id === projectId)
    return project ? project.name : 'No Project'
  }

  return (
    <div className="container mx-auto max-w-7xl">
      {/* Header */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-8 sm:mb-12"
      >
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-readable mb-3 sm:mb-4">
          Task Management Dashboard
        </h2>
        <p className="text-base sm:text-lg text-readable-secondary max-w-2xl mx-auto">
          Create, organize, and track your tasks efficiently with our powerful dashboard
        </p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 lg:gap-8">
        {/* Sidebar */}
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="lg:col-span-1"
        >
          <div className="glass-card p-4 sm:p-6 rounded-2xl mb-6">
            {/* Create Task Button */}
            <motion.button
              onClick={() => setShowTaskForm(!showTaskForm)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 btn-text-primary p-3 sm:p-4 rounded-2xl font-medium transition-all duration-300 flex items-center justify-center space-x-2 mb-6"
            >
              <ApperIcon name="Plus" className="w-5 h-5" />
              <span>New Task</span>
            </motion.button>

            {/* Filters */}
            <div className="space-y-3">
              <div className="mb-4">
                <Link
                  to="/analytics"
                  className="w-full bg-gradient-to-r from-secondary-600 to-secondary-700 hover:from-secondary-700 hover:to-secondary-800 btn-text-primary p-3 rounded-xl font-medium transition-all duration-300 flex items-center justify-center space-x-2"
                >
                  <ApperIcon name="BarChart3" className="w-5 h-5" />
                  <span>Analytics</span>
                </Link>
              </div>
              
              <div className="mb-4">
                <Link
                  to="/calendar"
                  className="w-full bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 btn-text-primary p-3 rounded-xl font-medium transition-all duration-300 flex items-center justify-center space-x-2"
                >
                  <ApperIcon name="Calendar" className="w-5 h-5" />
                  <span>Calendar</span>
                </Link>
              </div>
              
              <h3 className="font-semibold text-readable">Filters</h3>
              <h3 className="font-semibold text-readable-primary">Filters</h3>
                { key: 'all', label: 'All Tasks', icon: 'List' },
                { key: 'pending', label: 'Pending', icon: 'Clock' },
                { key: 'in-progress', label: 'In Progress', icon: 'Play' },
                { key: 'completed', label: 'Completed', icon: 'CheckCircle' }
              ].map((filter) => (
                <motion.button
                  key={filter.key}
                  onClick={() => setActiveFilter(filter.key)}
                  whileHover={{ x: 4 }}
                  className={`w-full flex items-center space-x-3 p-3 rounded-xl transition-all duration-200 ${
                    activeFilter === filter.key
                      ? 'bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-300'
                      : 'text-surface-readable hover:bg-surface-100 dark:hover:bg-surface-700'
                  }`}
                >
                  <ApperIcon name={filter.icon} className="w-4 h-4" />
                  <span className="text-sm font-medium text-readable-primary">{filter.label}</span>
                </motion.button>
              ))}
            </div>

            {/* Projects */}
            <div className="mt-6 pt-6 border-t border-surface-200 dark:border-surface-700">
              <h3 className="font-semibold text-readable-primary mb-3">Projects</h3>
              <div className="space-y-2">
                {projects.map((project) => (
                  <div key={project.id} className="flex items-center space-x-3 p-2 rounded-lg">
                    <div 
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: project.color }}
                    />
                    <span className="text-sm text-surface-readable">
                      {project.name}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Main Content */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="lg:col-span-3"
        >
          {/* Search and Stats */}
          <div className="glass-card p-4 sm:p-6 rounded-2xl mb-6">
            <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 items-start sm:items-center justify-between mb-4">
              {/* Search */}
              <div className="relative flex-1 max-w-md">
                <ApperIcon name="Search" className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-surface-muted" />
                <input
                  type="text"
                  placeholder="Search tasks..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-surface-50 dark:bg-surface-800 border border-surface-200 dark:border-surface-600 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all duration-200"
                />
              </div>

              {/* Quick Stats */}
              <div className="flex gap-4 text-sm">
                <div className="text-center">
                  <div className="font-bold text-primary-600">{tasks.filter(t => t.status === 'completed').length}</div>
                  <div className="text-readable-muted">Completed</div>
                </div>
                <div className="text-center">
                  <div className="font-bold text-secondary-600">{tasks.filter(t => t.status === 'in-progress').length}</div>
                  <div className="text-readable-muted">In Progress</div>
                </div>
                <div className="text-center">
                  <div className="font-bold text-readable">{tasks.length}</div>
                  <div className="text-readable-muted">Total</div>
                </div>
              </div>
            </div>
          </div>

          {/* Task Form */}
          <AnimatePresence>
            {showTaskForm && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="glass-card p-4 sm:p-6 rounded-2xl mb-6 overflow-hidden"
              >
                <h3 className="text-lg sm:text-xl font-semibold text-readable mb-4 sm:mb-6">
                  {editingTask ? 'Edit Task' : 'Create New Task'}
                </h3>
                
                <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                    {/* Title */}
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-readable-primary mb-2">
                        Task Title *
                      </label>
                      <input
                        type="text"
                        value={formData.title}
                        onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                        className="w-full p-3 sm:p-4 bg-surface-50 dark:bg-surface-800 border border-surface-200 dark:border-surface-600 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all duration-200 form-input"
                        placeholder="Enter task title..." 
                      />
                    </div>

                    {/* Priority */}
                    <div>
                      <label className="block text-sm font-medium text-readable-primary mb-2">
                        Priority
                      </label>
                      <select
                        value={formData.priority}
                        onChange={(e) => setFormData(prev => ({ ...prev, priority: e.target.value }))}
                        className="w-full p-3 sm:p-4 bg-surface-50 dark:bg-surface-800 border border-surface-200 dark:border-surface-600 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all duration-200"
                      >
                        <option value="low">Low Priority</option>
                        <option value="medium">Medium Priority</option>
                        <option value="high">High Priority</option>
                      </select>
                    </div>

                    {/* Due Date */}
                    <div>
                      <label className="block text-sm font-medium text-readable-primary mb-2">
                        Due Date
                      </label>
                      <input
                        type="date"
                        value={formData.dueDate}
                        onChange={(e) => setFormData(prev => ({ ...prev, dueDate: e.target.value }))}
                        className="w-full p-3 sm:p-4 bg-surface-50 dark:bg-surface-800 border border-surface-200 dark:border-surface-600 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all duration-200"
                      />
                    </div>

                    {/* Project */}
                    <div>
                      <label className="block text-sm font-medium text-readable-primary mb-2">
                        Project
                      </label>
                      <select
                        value={formData.projectId}
                        onChange={(e) => setFormData(prev => ({ ...prev, projectId: e.target.value }))}
                        className="w-full p-3 sm:p-4 bg-surface-50 dark:bg-surface-800 border border-surface-200 dark:border-surface-600 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all duration-200"
                      >
                        <option value="">Select Project</option>
                        {projects.map(project => (
                          <option key={project.id} value={project.id}>{project.name}</option>
                        ))}
                      </select>
                    </div>

                    {/* Tags */}
                    <div>
                      <label className="block text-sm font-medium text-readable-primary mb-2">
                        Tags (comma separated)
                      </label>
                      <input
                        type="text"
                        value={formData.tags}
                        onChange={(e) => setFormData(prev => ({ ...prev, tags: e.target.value }))}
                        className="w-full p-3 sm:p-4 bg-surface-50 dark:bg-surface-800 border border-surface-200 dark:border-surface-600 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all duration-200 form-input"
                        placeholder="design, frontend, urgent..."
                      />
                    </div>

                    {/* Description */}
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-readable-primary mb-2">
                        Description
                      </label>
                      <textarea
                        value={formData.description}
                        onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                        rows={3}
                        className="w-full p-3 sm:p-4 bg-surface-50 dark:bg-surface-800 border border-surface-200 dark:border-surface-600 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all duration-200 resize-none"
                        placeholder="Describe the task details..."
                      />
                    </div>
                  </div>

                  {/* Form Actions */}
                  <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-4 border-t border-surface-200 dark:border-surface-700">
                    <motion.button
                      type="submit"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="flex-1 sm:flex-none bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 btn-text-primary px-6 py-3 rounded-xl font-medium transition-all duration-300"
                    >
                      {editingTask ? 'Update Task' : 'Create Task'}
                    </motion.button>
                    <motion.button
                      type="button"
                      onClick={resetForm}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="flex-1 sm:flex-none bg-surface-100 dark:bg-surface-700 hover:bg-surface-200 dark:hover:bg-surface-600 btn-text-secondary px-6 py-3 rounded-xl font-medium transition-all duration-300"
                    >
                      Cancel
                    </motion.button>
                  </div>
                </form>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Time Entry Form */}
          <AnimatePresence>
            {showTimeForm && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="glass-card p-4 sm:p-6 rounded-2xl mb-6 overflow-hidden"
              >
                <h3 className="text-lg sm:text-xl font-semibold text-readable mb-4 sm:mb-6">
                  {editingTimeEntry ? 'Edit Time Entry' : 'Log Time'}
                </h3>
                
                <form onSubmit={handleTimeSubmit} className="space-y-4 sm:space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
                    {/* Hours */}
                    <div>
                      <label className="block text-sm font-medium text-readable-primary mb-2">
                        Hours *
                      </label>
                      <input
                        type="number"
                        step="0.5"
                        min="0"
                        value={timeFormData.hours}
                        onChange={(e) => setTimeFormData(prev => ({ ...prev, hours: e.target.value }))}
                        className="w-full p-3 sm:p-4 bg-surface-50 dark:bg-surface-800 border border-surface-200 dark:border-surface-600 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all duration-200"
                        placeholder="2.5"
                      />
                    </div>

                    {/* Date */}
                    <div>
                      <label className="block text-sm font-medium text-readable-primary mb-2">
                        Date *
                      </label>
                      <input
                        type="date"
                        value={timeFormData.date}
                        onChange={(e) => setTimeFormData(prev => ({ ...prev, date: e.target.value }))}
                        className="w-full p-3 sm:p-4 bg-surface-50 dark:bg-surface-800 border border-surface-200 dark:border-surface-600 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all duration-200"
                      />
                    </div>

                    {/* Description */}
                    <div>
                      <label className="block text-sm font-medium text-readable-primary mb-2">
                        Description
                      </label>
                      <input
                        type="text"
                        value={timeFormData.description}
                        onChange={(e) => setTimeFormData(prev => ({ ...prev, description: e.target.value }))}
                        className="w-full p-3 sm:p-4 bg-surface-50 dark:bg-surface-800 border border-surface-200 dark:border-surface-600 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none transition-all duration-200"
                        placeholder="What did you work on?"
                      />
                    </div>
                  </div>

                  {/* Form Actions */}
                  <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-4 border-t border-surface-200 dark:border-surface-700">
                    <motion.button
                      type="submit"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="flex-1 sm:flex-none bg-gradient-to-r from-primary-500 to-primary-600 hover:from-primary-600 hover:to-primary-700 btn-text-primary px-6 py-3 rounded-xl font-medium transition-all duration-300"
                    >
                      {editingTimeEntry ? 'Update Time' : 'Add Time'}
                    </motion.button>
                    <motion.button
                      type="button"
                      onClick={closeTimeForm}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="flex-1 sm:flex-none bg-surface-100 dark:bg-surface-700 hover:bg-surface-200 dark:hover:bg-surface-600 btn-text-secondary px-6 py-3 rounded-xl font-medium transition-all duration-300"
                    >
                      Cancel
                    </motion.button>
                  </div>
                </form>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Tasks List */}
          <div className="space-y-4">
            <AnimatePresence>
              {filteredTasks.map((task, index) => (
                <motion.div
                  key={task.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ delay: index * 0.1 }}
                  className={`glass-card p-4 sm:p-6 rounded-2xl transition-all duration-300 hover:shadow-lg ${
                    task.status === 'completed' ? 'opacity-75' : ''
                  }`}
                >
                  <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
                    {/* Task Checkbox */}
                    <motion.button
                      onClick={() => toggleTaskStatus(task.id)}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className="flex-shrink-0 self-start sm:self-center"
                    >
                      <ApperIcon 
                        name={getStatusIcon(task.status)} 
                        className={`w-6 h-6 ${
                          task.status === 'completed' 
                            ? 'text-green-500' 
                            : task.status === 'in-progress'
                            ? 'text-yellow-500'
                            : 'text-surface-400 hover:text-primary-500'
                        } transition-colors`}
                      />
                    </motion.button>

                    {/* Task Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2 sm:gap-4 mb-3">
                        <h4 className={`text-lg font-semibold ${
                          task.status === 'completed' 
                            ? 'text-readable-muted line-through' 
                            : 'text-readable-primary'
                        }`}>
                          {task.title}
                        </h4>
                        
                        <div className="flex items-center gap-2">
                          {/* Priority Badge */}
                          <span className={`px-2 py-1 text-xs font-medium rounded-lg border ${getPriorityColor(task.priority)}`}>
                            {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
                          </span>
                          
                          {/* Time Badge */}
                          {getTotalTimeForTask(task) > 0 && (
                            <span className="px-2 py-1 text-xs font-medium rounded-lg bg-blue-50 text-blue-600 border border-blue-200">
                              {getTotalTimeForTask(task)}h logged
                            </span>
                          )}
                          
                          {/* Actions */}
                          <div className="flex gap-1">
                            <motion.button
                              onClick={() => handleAddTime(task.id)}
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              className="p-2 text-surface-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-all duration-200"
                              title="Log time"
                            >
                              <ApperIcon name="Clock" className="w-4 h-4" />
                            </motion.button>
                            <motion.button
                              onClick={() => handleEdit(task)}
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              className="p-2 text-surface-500 hover:text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-900/20 rounded-lg transition-all duration-200"
                            >
                              <ApperIcon name="Edit" className="w-4 h-4" />
                            </motion.button>
                            <motion.button
                              onClick={() => handleDelete(task.id)}
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              className="p-2 text-surface-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-all duration-200"
                            >
                              <ApperIcon name="Trash2" className="w-4 h-4" />
                            </motion.button>
                          </div>
                        </div>
                      </div>

                      {task.description && (
                        <p className="text-surface-readable mb-3 text-sm sm:text-base">
                          {task.description}
                        </p>
                      )}

                      {/* Task Meta */}
                      <div className="flex flex-wrap gap-3 sm:gap-4 text-sm text-surface-muted">
                        {task.dueDate && (
                          <div className="flex items-center gap-1">
                            <ApperIcon name="Calendar" className="w-4 h-4" />
                            <span>{format(new Date(task.dueDate), 'MMM dd, yyyy')}</span>
                          </div>
                        )}
                        
                        {task.projectId && (
                          <div className="flex items-center gap-1">
                            <ApperIcon name="Folder" className="w-4 h-4" />
                            <span>{getProjectName(task.projectId)}</span>
                          </div>
                        )}

                        {task.tags.length > 0 && (
                          <div className="flex items-center gap-1 flex-wrap">
                            <ApperIcon name="Tag" className="w-4 h-4" />
                            <div className="flex gap-1 flex-wrap">
                              {task.tags.map((tag, tagIndex) => (
                                <span 
                                  key={tagIndex}
                                  className="px-2 py-1 bg-surface-100 dark:bg-surface-700 text-surface-readable rounded-md text-xs"
                                >
                                  {tag}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Time Entries */}
                      {task.timeEntries && task.timeEntries.length > 0 && (
                        <div className="mt-4 pt-4 border-t border-surface-200 dark:border-surface-700">
                          <div className="flex items-center justify-between mb-3">
                            <h5 className="text-sm font-medium text-readable-primary">
                              Time Entries ({getTotalTimeForTask(task)}h total)
                            </h5>
                          </div>
                          <div className="space-y-2">
                            {task.timeEntries.map((timeEntry) => (
                              <div
                                key={timeEntry.id}
                                className="flex items-center justify-between p-3 bg-surface-50 dark:bg-surface-800 rounded-lg"
                              >
                                <div className="flex-1">
                                  <div className="flex items-center gap-2 text-sm">
                                    <span className="font-medium text-readable-primary">
                                      {timeEntry.hours}h
                                    </span>
                                    <span className="text-readable-muted">•</span>
                                    <span className="text-surface-readable">
                                      {format(new Date(timeEntry.date), 'MMM dd, yyyy')}
                                    </span>
                                  </div>
                                  {timeEntry.description && (
                                    <div className="text-xs text-surface-500 mt-1">
                                      {timeEntry.description}
                                    </div>
                                  )}
                                </div>
                                <div className="flex gap-1">
                                  <motion.button
                                    onClick={() => handleEditTimeEntry(task.id, timeEntry)}
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                    className="p-1 text-surface-400 hover:text-primary-600 rounded"
                                  >
                                    <ApperIcon name="Edit" className="w-3 h-3" />
                                  </motion.button>
                                  <motion.button
                                    onClick={() => handleDeleteTimeEntry(task.id, timeEntry.id)}
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                    className="p-1 text-surface-400 hover:text-red-600 rounded"
                                  >
                                    <ApperIcon name="Trash2" className="w-3 h-3" />
                                  </motion.button>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {filteredTasks.length === 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-12 sm:py-16"
              >
                <div className="w-16 h-16 sm:w-20 sm:h-20 bg-surface-100 dark:bg-surface-700 rounded-3xl flex items-center justify-center mx-auto mb-4 sm:mb-6">
                  <ApperIcon name="Search" className="w-8 h-8 sm:w-10 sm:h-10 text-readable-muted" />
                </div>
                <h3 className="text-lg sm:text-xl font-semibold text-readable-primary mb-2">
                  No tasks found
                </h3>
                <p className="text-surface-readable text-sm sm:text-base">
                  {searchQuery ? 'Try adjusting your search criteria' : 'Create your first task to get started'}
                </p>
              </motion.div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  )
}

export default MainFeature