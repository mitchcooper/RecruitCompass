import { PublicSubmitForm } from "@/components/public-form/public-submit-form";

export default function PublicForm() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        <div className="glass rounded-xl p-8 md:p-12">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-foreground tracking-tight mb-3">
              Submit New Recruit
            </h1>
            <p className="text-muted-foreground text-lg">
              Leaders can submit recruit information for review
            </p>
          </div>
          
          <PublicSubmitForm />
        </div>
      </div>
    </div>
  );
}
