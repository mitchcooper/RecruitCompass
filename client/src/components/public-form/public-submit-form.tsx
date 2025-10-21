import { useState } from "react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertRecruitSchema, type InsertRecruit } from "@shared/schema";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { useLeaders } from "@/hooks/use-leaders";
import { useTypes } from "@/hooks/use-types";
import { useCreateRecruit } from "@/hooks/use-recruits";
import { useToast } from "@/hooks/use-toast";

export function PublicSubmitForm() {
  const [submitted, setSubmitted] = useState(false);
  const { toast } = useToast();

  const { data: leaders = [] } = useLeaders();
  const { data: types = [] } = useTypes();
  const createRecruit = useCreateRecruit();

  const form = useForm<InsertRecruit>({
    resolver: zodResolver(insertRecruitSchema),
    defaultValues: {
      name: "",
      leaderId: "",
      typeId: "",
      date: new Date(),
      mobile: "",
      email: "",
      notes: "",
      status: "Submitted",
    },
  });

  const onSubmit = async (data: InsertRecruit) => {
    try {
      const submitData = {
        ...data,
        date: data.date instanceof Date ? data.date.toISOString() : new Date(data.date).toISOString(),
      };
      await createRecruit.mutateAsync(submitData as InsertRecruit);
      setSubmitted(true);
      setTimeout(() => {
        setSubmitted(false);
        form.reset();
      }, 3000);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit recruit",
        variant: "destructive",
      });
    }
  };

  if (submitted) {
    return (
      <div className="text-center py-12">
        <CheckCircle2 className="w-16 h-16 text-green-600 mx-auto mb-4" />
        <h2 className="text-2xl font-semibold text-foreground mb-2">
          Submission Received!
        </h2>
        <p className="text-muted-foreground">
          Your recruit submission has been sent for review.
        </p>
      </div>
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="grid gap-6">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-base">
                  Recruit Name <span className="text-accent">*</span>
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter full name"
                    className="text-base"
                    {...field}
                    data-testid="input-public-name"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="leaderId"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-base">
                  Leader <span className="text-accent">*</span>
                </FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger className="text-base" data-testid="select-public-leader">
                      <SelectValue placeholder="Select leader" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {leaders.map((leader) => (
                      <SelectItem key={leader.id} value={leader.id}>
                        {leader.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="typeId"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-base">
                  Recruitment Type <span className="text-accent">*</span>
                </FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger className="text-base" data-testid="select-public-type">
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {types.map((type) => (
                      <SelectItem key={type.id} value={type.id}>
                        {type.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="date"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-base">
                  Date <span className="text-accent">*</span>
                </FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full pl-3 text-left font-normal text-base",
                          !field.value && "text-muted-foreground"
                        )}
                        data-testid="button-public-date"
                      >
                        {field.value ? (
                          format(new Date(field.value), "PPP")
                        ) : (
                          <span>Pick a date</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value ? new Date(field.value) : undefined}
                      onSelect={field.onChange}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="mobile"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-base">
                  Mobile Number <span className="text-accent">*</span>
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder="Enter mobile number"
                    className="text-base"
                    {...field}
                    data-testid="input-public-mobile"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-base">
                  Email Address <span className="text-accent">*</span>
                </FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    placeholder="Enter email address"
                    className="text-base"
                    {...field}
                    data-testid="input-public-email"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="notes"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-base">Notes (Optional)</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Additional information"
                    className="resize-none text-base"
                    rows={4}
                    {...field}
                    data-testid="input-public-notes"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <Button
          type="submit"
          className="w-full text-base h-12"
          data-testid="button-submit-public-form"
        >
          Submit Recruit
        </Button>
      </form>
    </Form>
  );
}
