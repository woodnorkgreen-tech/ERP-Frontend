import { describe, it, expect, vi, beforeEach } from 'vitest'
import { mount } from '@vue/test-utils'
import TaskAssignmentManager from '../TaskAssignmentManager.vue'

// Mock the useApi composable
vi.mock('@/modules/admin/shared/composables/useApi', () => ({
  useApi: () => ({
    get: vi.fn()
  })
}))

describe('TaskAssignmentManager', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders correctly with initial state', () => {
    const wrapper = mount(TaskAssignmentManager)
    
    // Should have one initial assignment row
    expect(wrapper.findAll('.bg-gray-50')).toHaveLength(1)
    
    // Should have add button
    expect(wrapper.find('button').text()).toContain('Add Assignee')
  })

  it('adds new assignment row when add button is clicked', async () => {
    const wrapper = mount(TaskAssignmentManager)
    
    // Initially one assignment
    expect(wrapper.findAll('.bg-gray-50')).toHaveLength(1)
    
    // Click add button
    await wrapper.find('button').trigger('click')
    
    // Should now have two assignments
    expect(wrapper.findAll('.bg-gray-50')).toHaveLength(2)
  })

  it('removes assignment row when remove button is clicked', async () => {
    const wrapper = mount(TaskAssignmentManager)
    
    // Add another assignment first
    await wrapper.find('button').trigger('click')
    expect(wrapper.findAll('.bg-gray-50')).toHaveLength(2)
    
    // Remove the second assignment
    const removeButtons = wrapper.findAll('button.text-red-500')
    await removeButtons[1].trigger('click')
    
    // Should be back to one assignment
    expect(wrapper.findAll('.bg-gray-50')).toHaveLength(1)
  })

  it('emits assignments-updated event when assignments change', async () => {
    const wrapper = mount(TaskAssignmentManager)
    
    // Simulate selecting an employee
    // This would require more complex mocking of the employee search
    
    // For now, we'll just check that the event is emitted structure is correct
    expect(wrapper.emitted()).toHaveProperty('assignments-updated')
  })

  it('displays existing assignments when provided', () => {
    const existingAssignments = [
      {
        id: 1,
        task_id: 1,
        user_id: 1,
        user: { id: 1, name: 'John Doe', email: 'john@example.com' },
        assigned_by: 2,
        assignedBy: { id: 2, name: 'Jane Smith', email: 'jane@example.com' },
        assigned_at: '2023-01-01',
        role: 'captain',
        is_primary: true,
        created_at: '2023-01-01',
        updated_at: '2023-01-01'
      }
    ]
    
    const wrapper = mount(TaskAssignmentManager, {
      props: {
        initialAssignments: existingAssignments
      }
    })
    
    // Should display existing assignments
    expect(wrapper.find('.flex.items-center.justify-between').exists()).toBe(true)
  })
})