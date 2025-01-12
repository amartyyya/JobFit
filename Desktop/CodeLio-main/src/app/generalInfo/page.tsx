'use client'

import { useState } from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useFieldArray, useForm } from 'react-hook-form'
import * as z from 'zod'
import { Trash2, Plus } from 'lucide-react'
import { infoSchema } from '@/schemas/infoSchema'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/general-info-UI/(components)/form'
import { Input } from '@/components/general-info-UI/(components)/input'
import { Button } from '@/components/general-info-UI/(components)/button'
import { Textarea } from '@/components/general-info-UI/(components)/textarea'
import { Card, CardContent } from '@/components/general-info-UI/(components)/card'
import { useToast } from '@/components/general-info-UI/(components)/use-toast'
import { PortfolioPage } from '../portfolio/page'

// Extend the infoSchema to include the profile image
const extendedInfoSchema = infoSchema.extend({
  profileImage: z.instanceof(File).optional(),
})

type FormData = z.infer<typeof extendedInfoSchema>

export default function GeneralInfoForm() {
  const { toast } = useToast()
  const [portfolioData, setPortfolioData] = useState<FormData | null>(null)
  
  const form = useForm<FormData>({
    resolver: zodResolver(extendedInfoSchema),
    defaultValues: {
      introduction: '',
      experience: '',
      linkedin: '',
      github: '',
      codechef: '',
      codeforces: '',
      leetcode: '',
      gfg: '',
      projects: [{ title: '', description: '', technologies: [], link: '' }]
    }
  })

  const { fields, append, remove } = useFieldArray({
    name: "projects",
    control: form.control
  })

  function onSubmit(data: FormData) {
    setPortfolioData(data)
    toast({
      title: "Success",
      description: "Information saved successfully",
    })
  }

  if (portfolioData) {
    return <PortfolioPage portfolioData={portfolioData} />
  }

  return (
    <div className="container mx-auto py-8">
      <Card>
        <CardContent className="p-6">
          <h1 className="text-2xl font-bold text-center mb-6 flex items-center justify-center gap-2">
            <div className="rounded-full bg-[#F5A623] p-3">
              <div className="h-6 w-6 rounded-full border-2 border-white relative">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="h-3 w-3 rotate-45 border-r-2 border-t-2 border-white" />
                </div>
              </div>
            </div>
            <span className="text-[#F5A623]">codeLio</span>
          </h1>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <div className="space-y-4">
                <FormField
                  control={form.control}
                  name="profileImage"
                  render={({ field: { onChange, value, ...rest } }) => (
                    <FormItem>
                      <FormLabel>Profile Image</FormLabel>
                      <FormControl>
                        <Input
                          type="file"
                          accept="image/*"
                          onChange={(e) => {
                            const file = e.target.files?.[0]
                            if (file) {
                              onChange(file)
                            }
                          }}
                          {...rest}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="introduction"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Introduction</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Write a brief introduction about yourself"
                          className="min-h-[100px] focus-visible:ring-[#F5A623]"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="experience"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Experience</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Describe your experience"
                          className="min-h-[100px] focus-visible:ring-[#F5A623]"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="space-y-4">
                <h2 className="text-xl font-semibold">Social & Coding Profiles</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="linkedin"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>LinkedIn URL</FormLabel>
                        <FormControl>
                          <Input placeholder="https://linkedin.com/in/..." className="focus-visible:ring-[#F5A623]" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="github"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>GitHub URL</FormLabel>
                        <FormControl>
                          <Input placeholder="https://github.com/..." className="focus-visible:ring-[#F5A623]" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="codechef"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>CodeChef URL (Optional)</FormLabel>
                        <FormControl>
                          <Input placeholder="https://codechef.com/users/..." className="focus-visible:ring-[#F5A623]" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="codeforces"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Codeforces URL (Optional)</FormLabel>
                        <FormControl>
                          <Input placeholder="https://codeforces.com/profile/..." className="focus-visible:ring-[#F5A623]" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="leetcode"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>LeetCode URL (Optional)</FormLabel>
                        <FormControl>
                          <Input placeholder="https://leetcode.com/..." className="focus-visible:ring-[#F5A623]" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="gfg"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>GeeksforGeeks URL (Optional)</FormLabel>
                        <FormControl>
                          <Input placeholder="https://auth.geeksforgeeks.org/user/..." className="focus-visible:ring-[#F5A623]" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h2 className="text-xl font-semibold">Projects</h2>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="border-[#F5A623] text-[#F5A623] hover:bg-[#F5A623]/10"
                    onClick={() => append({ title: '', description: '', technologies: [], link: '' })}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Project
                  </Button>
                </div>

                {fields.map((field, index) => (
                  <Card key={field.id}>
                    <CardContent className="p-4 space-y-4">
                      <div className="flex justify-between items-center">
                        <h3 className="font-medium">Project {index + 1}</h3>
                        {index > 0 && (
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="text-red-500 hover:text-red-700"
                            onClick={() => remove(index)}
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        )}
                      </div>

                      <FormField
                        control={form.control}
                        name={`projects.${index}.title`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Project Title</FormLabel>
                            <FormControl>
                              <Input className="focus-visible:ring-[#F5A623]" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name={`projects.${index}.description`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Project Description</FormLabel>
                            <FormControl>
                              <Textarea 
                                className="min-h-[100px] focus-visible:ring-[#F5A623]"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name={`projects.${index}.technologies`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Technologies (comma-separated)</FormLabel>
                            <FormControl>
                              <Input 
                                className="focus-visible:ring-[#F5A623]"
                                {...field}
                                value={field.value?.join(', ')}
                                onChange={(e) => {
                                  const value = e.target.value
                                  field.onChange(value.split(',').map(tech => tech.trim()).filter(Boolean))
                                }}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name={`projects.${index}.link`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Project Link (Optional)</FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="https://..."
                                className="focus-visible:ring-[#F5A623]"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </CardContent>
                  </Card>
                ))}
              </div>

              <Button type="submit" className="w-full bg-[#F5A623] hover:bg-[#F5A623]/90">
                Save Information
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
}

