import * as React from 'react';
import { useFormContext } from 'react-hook-form';

import axios from 'axios';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { BASE_URL } from '@/redux/slices/authSlice';

interface FileUploadFieldProps {
  name: string;
  label: string;
  description?: string;
  url?: string | undefined
}

export const FileUploadField: React.FC<FileUploadFieldProps> = ({ name, label, description, url }) => {
  const { control, watch, setValue } = useFormContext();
  const [isUploading, setIsUploading] = React.useState<boolean>(false);
  const token = localStorage.getItem('user-token') || 'unauthorized';

  const currentImageUrl: string = watch(name);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await axios.post(`${BASE_URL}/aws-s3/image`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
        timeout: 10000,
      });

      const imageUrl = response.data.url;

      setValue(name, imageUrl, { shouldValidate: true });
      toast.success('Image uploaded successfully!');
    } catch (error) {
      console.error('File upload failed:', error);
      toast.error('File upload failed.');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <FormField
      control={control}
      name={name as string}
      render={() => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <div className="flex items-center gap-4">
            <Avatar className={`h-20 w-20 border ${name === 'templateImagee' ? 'rounded-none w-24' : ''}`}>
              <AvatarImage src={currentImageUrl || url} alt="Image Preview" />
              <AvatarFallback>PIC</AvatarFallback>
            </Avatar>

            <div className="grid w-full max-w-sm items-center gap-1.5">
              <FormControl>
                <Input
                  type="file"
                  onChange={handleFileChange}
                  disabled={isUploading}
                  accept="image/png, image/jpeg, image/jpg"
                />
              </FormControl>
              {isUploading && (
                <div className="flex items-center text-sm text-muted-foreground">
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Uploading...
                </div>
              )}
            </div>
          </div>
          {description && <FormDescription>{description}</FormDescription>}
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
