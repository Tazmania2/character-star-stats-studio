# Utilities Documentation

## Error Handling

### Error Handler (`errorHandler.ts`)

Provides utilities for detecting, transforming, and handling errors throughout the application.

**Usage:**

```typescript
import { handleError, transformError, ErrorType } from '../utils/errorHandler';

try {
  await apiCall();
} catch (error) {
  const errorInfo = handleError(error, 'API Call Context');
  // errorInfo contains: { type, message, originalError, statusCode?, field? }
  
  // Use the error info to display user-friendly messages
  showToast(errorInfo.message, 'error');
}
```

**Key Functions:**

- `detectErrorType(error)` - Determines the error type (auth, validation, network, server, unknown)
- `transformError(error)` - Converts any error into a structured ErrorInfo object
- `getUserFriendlyMessage(type, statusCode?, error?)` - Returns user-friendly error messages
- `handleError(error, context?)` - Logs and transforms errors in one call
- `logError(error, context?)` - Logs error details for debugging

## Validation

### Validation Helpers (`validation.ts`)

Provides validation functions for all form inputs with detailed error messages.

**Usage:**

```typescript
import { validateAreaId, validateAreaTitle, validateLevelFields, assertValid } from '../utils/validation';

// Validate individual fields
const idResult = validateAreaId(areaId);
if (!idResult.isValid) {
  console.error(idResult.error); // "Area ID is required"
}

// Validate level fields
const levelResult = validateLevelFields({
  area: 'combat',
  level: 'Beginner',
  position: 0,
  minPoints: 100
});

// Throw error if validation fails
try {
  assertValid(levelResult);
  // Proceed with valid data
} catch (error) {
  // Handle ValidationError
}
```

**Available Validators:**

- `validateAreaId(id)` - Validates area ID (required, kebab-case format)
- `validateAreaTitle(title)` - Validates area title (required, 2-100 chars)
- `validateLevelFields(fields)` - Validates all level fields
- `validateServerUrl(url)` - Validates server URL (required, valid HTTP/HTTPS)
- `validateBearerToken(token)` - Validates bearer token (required, min length)
- `assertValid(result)` - Throws ValidationError if validation fails
- `validateMultiple(validations)` - Validates multiple fields and returns all errors

## Toast Notifications

### Toast Context (`ToastContext.tsx`)

Provides a context and hook for displaying toast notifications throughout the app.

**Setup:**

Wrap your app with `ToastProvider`:

```typescript
import { ToastProvider } from './contexts/ToastContext';

function App() {
  return (
    <ToastProvider>
      {/* Your app components */}
    </ToastProvider>
  );
}
```

**Usage:**

```typescript
import { useToast } from '../contexts/ToastContext';

function MyComponent() {
  const { showSuccess, showError, showInfo, showWarning } = useToast();
  
  const handleSave = async () => {
    try {
      await saveData();
      showSuccess('Data saved successfully!');
    } catch (error) {
      showError('Failed to save data');
    }
  };
  
  return <button onClick={handleSave}>Save</button>;
}
```

**Available Methods:**

- `showSuccess(message, duration?)` - Display success toast (green)
- `showError(message, duration?)` - Display error toast (red)
- `showInfo(message, duration?)` - Display info toast (blue)
- `showWarning(message, duration?)` - Display warning toast (yellow)
- `showToast(message, type, duration?)` - Display custom toast
- `removeToast(id)` - Manually remove a toast

Default duration is 5000ms (5 seconds).

## Error Boundary

### ErrorBoundary Component

Catches React errors and displays a fallback UI.

**Usage:**

```typescript
import { ErrorBoundary } from '../components/ErrorBoundary';

function App() {
  return (
    <ErrorBoundary>
      {/* Your app components */}
    </ErrorBoundary>
  );
}

// With custom fallback
<ErrorBoundary
  fallback={(error, resetError) => (
    <div>
      <h1>Custom Error UI</h1>
      <p>{error.message}</p>
      <button onClick={resetError}>Try Again</button>
    </div>
  )}
>
  {/* Your app components */}
</ErrorBoundary>
```

## Integration Example

Here's how to use all utilities together:

```typescript
import { useToast } from '../contexts/ToastContext';
import { handleError } from '../utils/errorHandler';
import { validateAreaId, validateAreaTitle } from '../utils/validation';

function AreaForm() {
  const { showSuccess, showError } = useToast();
  
  const handleSubmit = async (data: { id: string; title: string }) => {
    // Validate inputs
    const idValidation = validateAreaId(data.id);
    if (!idValidation.isValid) {
      showError(idValidation.error!);
      return;
    }
    
    const titleValidation = validateAreaTitle(data.title);
    if (!titleValidation.isValid) {
      showError(titleValidation.error!);
      return;
    }
    
    // Submit to API
    try {
      await createArea(data);
      showSuccess('Area created successfully!');
    } catch (error) {
      const errorInfo = handleError(error, 'Create Area');
      showError(errorInfo.message);
    }
  };
  
  return (/* form JSX */);
}
```
