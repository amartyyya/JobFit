import { z } from 'zod';


// Project schema
export const projectSchema = z.object({
    title: z.string().min(1, 'Title is required'),
    description: z.string().min(1, 'Description is required'),
    technologies: z.array(z.string()).min(1, 'At least one technology is required'),
    link: z.string().url('Please enter a valid URL').optional(),
  });
  
  // Info schema
  export const infoSchema = z.object({
    introduction: z.string().min(1, 'Introduction is required').max(3000,'Please enter less than 3000 Characters'),
    experience: z.string().min(1, 'Experience is required').max(3000,'Please enter less than 3000 Characters'),
    linkedin: z.string().url('Please enter a valid URL'),
    codechef: z.string().url('Please enter a valid URL').optional(),
    codeforces: z.string().url('Please enter a valid URL').optional(),
    github: z.string().url('Please enter a valid URL'),
    leetcode: z.string().url('Please enter a valid URL').optional(),
    gfg: z.string().url('Please enter a valid URL').optional(),
    projects: z.array(projectSchema).min(1, 'At least one project is required')
  });