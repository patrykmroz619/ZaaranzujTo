import { GripVertical } from 'lucide-react';
import { Group, Panel, Separator } from 'react-resizable-panels';

import { cn } from '@/core/ui/utils';

const ResizablePanelGroup = (
  props: React.ComponentProps<typeof Group> & {
    direction?: 'horizontal' | 'vertical';
  },
) => {
  const { className, direction, orientation, ...restProps } = props;

  return (
    <Group
      className={cn('flex h-full w-full', className)}
      orientation={orientation ?? direction}
      {...restProps}
    />
  );
};

const ResizablePanel = Panel;

const ResizableHandle = (
  props: React.ComponentProps<typeof Separator> & {
    withHandle?: boolean;
  },
) => {
  const { withHandle, className, ...restProps } = props;

  return (
    <Separator
      className={cn(
        'relative flex w-px items-center justify-center bg-border after:absolute after:inset-y-0 after:left-1/2 after:w-1 after:-translate-x-1/2 data-[separator=vertical]:h-px data-[separator=vertical]:w-full data-[separator=vertical]:after:left-0 data-[separator=vertical]:after:h-1 data-[separator=vertical]:after:w-full data-[separator=vertical]:after:-translate-y-1/2 data-[separator=vertical]:after:translate-x-0 focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-ring focus-visible:ring-offset-1 [&[data-separator=vertical]>div]:rotate-90',
        className,
      )}
      {...restProps}
    >
      {withHandle && (
        <div className="z-10 flex h-4 w-3 items-center justify-center rounded-sm border bg-border">
          <GripVertical className="h-2.5 w-2.5" />
        </div>
      )}
    </Separator>
  );
};

export { ResizablePanelGroup, ResizablePanel, ResizableHandle };
