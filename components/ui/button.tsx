import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center whitespace-nowrap text-sm font-medium transition-all focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50 rounded-[0.7rem] border-2 border-[rgb(50,50,50)] border-b-[5px] shadow-[0px_2px_8px_0px_rgba(0,0,0,0.2)] cursor-pointer duration-300 hover:brightness-110 hover:shadow-[0px_4px_12px_0px_rgba(0,0,0,0.3)] hover:scale-105 active:scale-95 active:duration-75',
  {
    variants: {
      variant: {
        default: 'bg-gradient-to-b from-[rgb(214,202,254)] to-[rgb(158,129,254)] text-slate-900',
        destructive: 'bg-gradient-to-b from-red-400 to-red-500 text-white',
        outline: 'bg-gradient-to-b from-slate-200 to-slate-300 text-slate-900',
        secondary: 'bg-gradient-to-b from-slate-300 to-slate-400 text-slate-900',
        ghost: 'bg-none border-0 shadow-none hover:bg-slate-200/20 text-slate-200',
        link: 'text-primary underline-offset-4 hover:underline border-0 shadow-none',
        location:
          'bg-gradient-to-br hover:scale-110 active:scale-90 shadow-[0_0_10px_rgba(0,0,0,0.3)] hover:shadow-[0_0_20px_rgba(255,255,255,0.5)] text-white border-none before:absolute before:inset-0 before:rounded-full before:bg-black/10 before:opacity-0 hover:before:opacity-100 before:transition-opacity',
      },
      size: {
        default: 'h-10 px-6 py-2.5',
        sm: 'h-9 px-4 py-2',
        lg: 'h-11 px-8 py-3',
        icon: 'h-9 w-9 p-0 rounded-full aspect-square',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button';
    return (
      <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />
    );
  }
);
Button.displayName = 'Button';

export { Button, buttonVariants };
