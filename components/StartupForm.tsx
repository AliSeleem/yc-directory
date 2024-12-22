"use client";

/* eslint-disable @typescript-eslint/no-explicit-any */
import { useToast } from '@/hooks/use-toast';
import { createPitch } from '@/lib/actions';
import { formSchema } from '@/lib/validation';
import { useRouter } from 'next/navigation';
import React, { useActionState, useState } from 'react'
import { z } from 'zod';
import { Input } from './ui/input';
import MDEditor from "@uiw/react-md-editor";

const StartupForm = () => {
  const { toast } = useToast();
  const router = useRouter();
  const [pitch, setPitch] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = async (prevState: any, formData: FormData) => {

    try {
      const formValues = {
        title: formData.get("title") as string,
        description: formData.get("description") as string,
        category: formData.get("category") as string,
        link: formData.get("link") as string,
        pitch,
      }
  
      await formSchema.parseAsync(formValues);
  
      const result = await createPitch(prevState, formData, pitch);
  
      if (result.status == "SUCCESS") {
        toast({
          title: "Success",
          description: "Your startup pitch has been created successfully",
        });
  
        router.push(`/startup/${result._id}`);
      }
  
      return result;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const fieldErorrs = error.flatten().fieldErrors;

        setErrors(fieldErorrs as unknown as Record<string, string>);

        toast({
          title: "Error",
          description: "Please check your inputs and try again",
          variant: "destructive",
        });

        return { ...prevState, error: "Validation failed", status: "ERROR" };
      }

      toast({
        title: "Error",
        description: "An unexpected error has occurred",
        variant: "destructive",
      });

      return {
        ...prevState,
        error: "An unexpected error has occurred",
        status: "ERROR",
      };
    }
  }

  const [, formAction, isPending] = useActionState(handleSubmit, {
    state: '',
    error: ''
  })


  return (
    <form action={formAction} className='startup-form'>
      <div>
        <label htmlFor="title" className='startup-form_label'>Title</label>
        <Input 
          id='title'
          name='title'
          className='startup-form_input'
          required
          placeholder='Startup Title'
        />
        {errors.title && <p className='startup-form_error'>{errors.title}</p>}
      </div>

      <div>
        <label htmlFor="description" className='startup-form_label'>Description</label>
        <Input 
          id='description'
          name='description'
          className='startup-form_input'
          required
          placeholder='Startup Description'
        />
        {errors.description && <p className='startup-form_error'>{errors.description}</p>}
      </div>

      <div>
        <label htmlFor="category" className='startup-form_label'>Category</label>
        <Input 
          id='category'
          name='category'
          className='startup-form_input'
          required
          placeholder='Startup Category'
        />
        {errors.category && <p className='startup-form_error'>{errors.category}</p>}
      </div>

      <div>
        <label htmlFor="link" className='startup-form_label'>Image URL</label>
        <Input 
          id='link'
          name='link'
          className='startup-form_input'
          required
          placeholder='Startup Image URL'
        />
        {errors.link && <p className='startup-form_error'>{errors.link}</p>}
      </div>

      <div data-color-mode="light">
        <label htmlFor="pitch" className='startup-form_label'>Pitch</label>
        <MDEditor 
          value={pitch}
          onChange={(value) => setPitch(value as string)}
          id="pitch"
          preview="edit"
          height={300}
          style={{ borderRadius: 20, overflow: "hidden" }}
          textareaProps={{
            placeholder:
              "Briefly describe your idea and what problem it solves",
          }}
          previewOptions={{
            disallowedElements: ["style"],
          }}
        />
        {errors.pitch && <p className='startup-form_error'>{errors.pitch}</p>}
      </div>

      <button type='submit' disabled={isPending} className='startup-form_btn'>{isPending? "Submiting..." : "Submit your startup"}</button>
    </form>
  )
}

export default StartupForm