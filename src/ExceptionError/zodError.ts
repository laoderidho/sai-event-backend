export function zodError(err: any){
    interface ZodErrorItem {
        path: (string | number)[];
        message: string;
        [key: string]: any;
    }

    interface ZodError {
        errors: ZodErrorItem[];
        [key: string]: any;
    }

    interface FieldError {
        field: string;
        message: string;
    }

    const errors: FieldError[] = (err as ZodError).errors.map((err: ZodErrorItem): FieldError => ({
        field: err.path.join('.'),
        message: err.message,
    }));

    return {
        status: 'failed',
        error: errors
    }
}