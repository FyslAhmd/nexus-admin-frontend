import React, { useEffect, useState, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import Swal from 'sweetalert2';
import { motion, Variants } from 'framer-motion';
import {
  HiSearch,
  HiPlusCircle,
  HiRefresh,
  HiPencil,
  HiTrash,
  HiFolder,
} from 'react-icons/hi';
import { HiSparkles, HiFolderOpen, HiCalendar, HiUser } from 'react-icons/hi2';
import { useAppDispatch, useAppSelector, usePermissions } from '../hooks';
import {
  fetchProjects,
  createProject,
  updateProject,
  deleteProject,
} from '../features/projects/projectsSlice';
import {
  Card,
  Button,
  Input,
  Select,
  Modal,
  Badge,
  LoadingSpinner,
  Pagination,
} from '../components/ui';
import {
  Project,
  ProjectStatus,
  CreateProjectData,
  UpdateProjectData,
  User,
} from '../types';

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: 'easeOut' as const },
  },
};

const Projects: React.FC = () => {
  const dispatch = useAppDispatch();
  const { projects, pagination, isLoading } = useAppSelector(
    (state) => state.projects
  );
  const { isAdmin } = usePermissions();

  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('');
  const [currentPage, setCurrentPage] = useState(1);
  const [createModalOpen, setCreateModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  const {
    register: registerCreate,
    handleSubmit: handleCreateSubmit,
    reset: resetCreate,
    formState: { errors: createErrors },
  } = useForm<CreateProjectData>();

  const {
    register: registerEdit,
    handleSubmit: handleEditSubmit,
    reset: resetEdit,
    setValue: setEditValue,
    formState: { errors: editErrors },
  } = useForm<UpdateProjectData>();

  const loadProjects = useCallback(() => {
    dispatch(
      fetchProjects({
        page: currentPage,
        limit: 10,
        search: searchTerm || undefined,
        status: filterStatus ? (filterStatus as ProjectStatus) : undefined,
      })
    );
  }, [dispatch, currentPage, searchTerm, filterStatus]);

  useEffect(() => {
    loadProjects();
  }, [loadProjects]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
    loadProjects();
  };

  const handleCreateProject = async (data: CreateProjectData) => {
    const result = await dispatch(createProject(data));
    if (createProject.fulfilled.match(result)) {
      toast.success('Project created successfully!');
      setCreateModalOpen(false);
      resetCreate();
    } else {
      toast.error(result.payload as string);
    }
  };

  const handleEditClick = (project: Project) => {
    setSelectedProject(project);
    setEditValue('name', project.name);
    setEditValue('description', project.description || '');
    setEditValue('status', project.status);
    setEditModalOpen(true);
  };

  const handleUpdateProject = async (data: UpdateProjectData) => {
    if (!selectedProject) return;

    const result = await dispatch(
      updateProject({ id: selectedProject._id, data })
    );
    if (updateProject.fulfilled.match(result)) {
      toast.success('Project updated successfully!');
      setEditModalOpen(false);
      setSelectedProject(null);
      resetEdit();
    } else {
      toast.error(result.payload as string);
    }
  };

  const handleDeleteClick = async (project: Project) => {
    const result = await Swal.fire({
      title: 'Delete Project?',
      text: `Are you sure you want to delete "${project.name}"? This action can be undone by an administrator.`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#64748b',
      confirmButtonText: 'Yes, delete it!',
      background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.95) 0%, rgba(15, 23, 42, 0.95) 100%)',
      color: '#f1f5f9',
      customClass: {
        popup: 'border border-white/10 rounded-2xl backdrop-blur-xl',
      },
    });

    if (result.isConfirmed) {
      const response = await dispatch(deleteProject(project._id));
      if (deleteProject.fulfilled.match(response)) {
        toast.success('Project deleted successfully');
      } else {
        toast.error(response.payload as string);
      }
    }
  };

  const getCreatorName = (createdBy: User | string) => {
    if (typeof createdBy === 'object' && createdBy !== null) {
      return createdBy.name;
    }
    return 'Unknown';
  };

  const statusOptions = [
    { value: '', label: 'All Status' },
    { value: ProjectStatus.ACTIVE, label: 'Active' },
    { value: ProjectStatus.ARCHIVED, label: 'Archived' },
  ];

  const projectStatusOptions = [
    { value: ProjectStatus.ACTIVE, label: 'Active' },
    { value: ProjectStatus.ARCHIVED, label: 'Archived' },
  ];

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      {/* Header */}
      <motion.div 
        variants={itemVariants}
        className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
      >
        <div>
          <h1 className="text-3xl font-bold text-white flex items-center gap-3">
            <HiFolderOpen className="w-8 h-8 text-primary-400" />
            Projects
          </h1>
          <p className="text-dark-400 mt-1">Manage and view all projects</p>
        </div>
        <Button onClick={() => setCreateModalOpen(true)}>
          <HiPlusCircle className="w-5 h-5 mr-2" />
          Create Project
        </Button>
      </motion.div>

      {/* Filters */}
      <motion.div variants={itemVariants}>
        <Card>
          <form onSubmit={handleSearch} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-2">
                <Input
                  placeholder="Search by name or description..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              <Select
                options={statusOptions}
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
              />
            </div>
            <div className="flex gap-3">
              <Button type="submit" variant="primary">
                <HiSearch className="w-4 h-4 mr-2" />
                Search
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setSearchTerm('');
                  setFilterStatus('');
                  setCurrentPage(1);
                }}
              >
                <HiRefresh className="w-4 h-4 mr-2" />
                Reset
              </Button>
            </div>
          </form>
        </Card>
      </motion.div>

      {/* Projects Grid */}
      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <LoadingSpinner size="lg" />
        </div>
      ) : projects.length === 0 ? (
        <motion.div variants={itemVariants}>
          <Card>
            <div className="flex flex-col items-center justify-center h-64 text-dark-400">
              <HiFolder className="w-16 h-16 mb-4 text-dark-500" />
              <p className="text-lg font-medium text-white">No projects found</p>
              <p className="text-sm">Create your first project to get started</p>
            </div>
          </Card>
        </motion.div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project, index) => (
              <motion.div
                key={project._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -4, transition: { duration: 0.2 } }}
              >
                <Card className="h-full hover:border-primary-500/30 transition-all duration-300">
                  <div className="flex flex-col h-full">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-white mb-2">
                          {project.name}
                        </h3>
                        <Badge
                          variant={
                            project.status === ProjectStatus.ACTIVE
                              ? 'success'
                              : project.status === ProjectStatus.ARCHIVED
                              ? 'warning'
                              : 'danger'
                          }
                          size="sm"
                        >
                          {project.status}
                        </Badge>
                      </div>
                      <div 
                        className="w-10 h-10 rounded-xl flex items-center justify-center"
                        style={{
                          background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.2) 0%, rgba(139, 92, 246, 0.2) 100%)',
                          border: '1px solid rgba(255, 255, 255, 0.1)',
                        }}
                      >
                        <HiFolderOpen className="w-5 h-5 text-primary-400" />
                      </div>
                    </div>

                    <p className="text-sm text-dark-400 mb-4 flex-1 line-clamp-2">
                      {project.description || 'No description provided'}
                    </p>

                    <div className="border-t border-white/10 pt-4 mt-auto">
                      <div className="flex items-center justify-between text-sm text-dark-400 mb-3">
                        <span className="flex items-center gap-1.5">
                          <HiUser className="w-4 h-4" />
                          {getCreatorName(project.createdBy)}
                        </span>
                        <span className="flex items-center gap-1.5">
                          <HiCalendar className="w-4 h-4" />
                          {new Date(project.createdAt).toLocaleDateString()}
                        </span>
                      </div>

                      {isAdmin && (
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleEditClick(project)}
                            className="flex-1"
                          >
                            <HiPencil className="w-4 h-4 mr-1" />
                            Edit
                          </Button>
                          <Button
                            size="sm"
                            variant="danger"
                            onClick={() => handleDeleteClick(project)}
                            className="flex-1"
                          >
                            <HiTrash className="w-4 h-4 mr-1" />
                            Delete
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Pagination */}
          {pagination && pagination.totalPages > 1 && (
            <motion.div variants={itemVariants}>
              <Pagination
                currentPage={pagination.currentPage}
                totalPages={pagination.totalPages}
                onPageChange={setCurrentPage}
              />
            </motion.div>
          )}
        </>
      )}

      {/* Create Modal */}
      <Modal
        isOpen={createModalOpen}
        onClose={() => {
          setCreateModalOpen(false);
          resetCreate();
        }}
        title="Create New Project"
      >
        <form
          onSubmit={handleCreateSubmit(handleCreateProject)}
          className="space-y-4"
        >
          <Input
            label="Project Name"
            placeholder="Enter project name"
            error={createErrors.name?.message}
            {...registerCreate('name', {
              required: 'Project name is required',
              minLength: {
                value: 2,
                message: 'Name must be at least 2 characters',
              },
              maxLength: {
                value: 100,
                message: 'Name cannot exceed 100 characters',
              },
            })}
          />

          <div>
            <label className="block text-sm font-medium text-dark-300 mb-2">
              Description
            </label>
            <textarea
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-dark-400 focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500/50 transition-all duration-200"
              rows={4}
              placeholder="Enter project description (optional)"
              {...registerCreate('description', {
                maxLength: {
                  value: 500,
                  message: 'Description cannot exceed 500 characters',
                },
              })}
            />
            {createErrors.description && (
              <p className="mt-1 text-sm text-rose-400">
                {createErrors.description.message}
              </p>
            )}
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
            <Button
              type="button"
              variant="ghost"
              onClick={() => {
                setCreateModalOpen(false);
                resetCreate();
              }}
            >
              Cancel
            </Button>
            <Button type="submit" loading={isLoading}>
              <HiSparkles className="w-4 h-4 mr-2" />
              Create Project
            </Button>
          </div>
        </form>
      </Modal>

      {/* Edit Modal */}
      <Modal
        isOpen={editModalOpen}
        onClose={() => {
          setEditModalOpen(false);
          setSelectedProject(null);
          resetEdit();
        }}
        title="Edit Project"
      >
        <form
          onSubmit={handleEditSubmit(handleUpdateProject)}
          className="space-y-4"
        >
          <Input
            label="Project Name"
            placeholder="Enter project name"
            error={editErrors.name?.message}
            {...registerEdit('name', {
              minLength: {
                value: 2,
                message: 'Name must be at least 2 characters',
              },
              maxLength: {
                value: 100,
                message: 'Name cannot exceed 100 characters',
              },
            })}
          />

          <div>
            <label className="block text-sm font-medium text-dark-300 mb-2">
              Description
            </label>
            <textarea
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-dark-400 focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500/50 transition-all duration-200"
              rows={4}
              placeholder="Enter project description"
              {...registerEdit('description', {
                maxLength: {
                  value: 500,
                  message: 'Description cannot exceed 500 characters',
                },
              })}
            />
            {editErrors.description && (
              <p className="mt-1 text-sm text-rose-400">
                {editErrors.description.message}
              </p>
            )}
          </div>

          <Select
            label="Status"
            options={projectStatusOptions}
            error={editErrors.status?.message}
            {...registerEdit('status')}
          />

          <div className="flex justify-end gap-3 pt-4 border-t border-white/10">
            <Button
              type="button"
              variant="ghost"
              onClick={() => {
                setEditModalOpen(false);
                setSelectedProject(null);
                resetEdit();
              }}
            >
              Cancel
            </Button>
            <Button type="submit" loading={isLoading}>
              <HiPencil className="w-4 h-4 mr-2" />
              Update Project
            </Button>
          </div>
        </form>
      </Modal>
    </motion.div>
  );
};

export default Projects;
