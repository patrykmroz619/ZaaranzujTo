type TLogotypeProps = {
  variant?: 'sidebar' | 'mobile';
};

export const Logotype = (props: TLogotypeProps) => {
  const { variant = 'sidebar' } = props;

  if (variant === 'mobile') {
    return (
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 bg-gradient-hero rounded-lg flex items-center justify-center">
          <span className="text-sm">📐</span>
        </div>
        <span className="font-bold text-foreground">MathMentor</span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <div className="w-10 h-10 bg-gradient-hero rounded-xl flex items-center justify-center">
        <span className="text-xl">📐</span>
      </div>
      <div>
        <h1 className="font-bold text-foreground">MathMentor</h1>
        <p className="text-xs text-muted-foreground">Learn smarter</p>
      </div>
    </div>
  );
};
