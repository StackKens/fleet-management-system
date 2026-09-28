// =============================================================================
// TOAST NOTIFICATIONS — Temporary Feedback Messages
// =============================================================================
//
// WHAT IS A TOAST?
// ---------------
// A toast is a small popup message that appears temporarily to give feedback.
// Examples:
//   - "Vehicle added successfully" (success)
//   - "Failed to delete vehicle" (error)
//   - "Request submitted" (info)
//
// Toasts auto-dismiss after a few seconds. They don't require user interaction.
//
// WHY TOASTS INSTEAD OF ALERTS?
// ----------------------------
// - alert() blocks the browser (bad UX)
// - alert() can't be styled
// - alert() can't auto-dismiss
// - Toasts are non-blocking and look professional
//
// HOW THIS TOAST SYSTEM WORKS:
// ---------------------------
// 1. A global state holds an array of active toasts
// 2. The toast() function adds a new toast to the array
// 3. Each toast auto-removes itself after a timeout
// 4. The Toaster component renders all active toasts
//
// This is a simplified version of libraries like react-hot-toast or sonner.
// =============================================================================

import * as React from 'react';
import type { ToastActionElement, ToastProps } from '@/components/ui/toast';

// =============================================================================
// CONFIGURATION
// =============================================================================

// WHY LIMIT TO 1 TOAST?
// --------------------
// Showing too many toasts at once is overwhelming. Limiting to 1 ensures
// the user sees the most recent message clearly.
const TOAST_LIMIT = 1;

// WHY 5 SECONDS?
// -------------
// - Too short (2s): User might not read it
// - Too long (30s): Clutters the screen
// - 5 seconds: Enough to read, not annoying
//
// WHEN THE BACKEND IS READY:
// -------------------------
// Error toasts might need to stay longer (10s) so users can read the error.
const TOAST_REMOVE_DELAY = 5000;

// =============================================================================
// TYPES
// =============================================================================

// ToasterToast extends ToastProps with an ID
// WHY AN ID?
// ---------
// Each toast needs a unique ID so we can:
//   - Remove a specific toast
//   - Update a specific toast
//   - Track which toasts are active
type ToasterToast = ToastProps & {
  id: string;
  title?: React.ReactNode;
  description?: React.ReactNode;
  action?: ToastActionElement;
};

// =============================================================================
// ACTION TYPES
// =============================================================================
// This is a reducer pattern (like Redux).
// Instead of directly modifying state, we dispatch actions.
//
// WHY A REDUCER?
// -------------
// - Predictable: Same action always produces same result
// - Debuggable: You can log every state change
// - Testable: Pure functions are easy to test
//
// ACTION TYPES:
// - ADD_TOAST: Add a new toast
// - UPDATE_TOAST: Modify an existing toast
// - DISMISS_TOAST: Start closing animation
// - REMOVE_TOAST: Remove from DOM
// =============================================================================

const actionTypes = {
  ADD_TOAST: 'ADD_TOAST',
  UPDATE_TOAST: 'UPDATE_TOAST',
  DISMISS_TOAST: 'DISMISS_TOAST',
  REMOVE_TOAST: 'REMOVE_TOAST',
} as const;

type ActionType = typeof actionTypes;

type Action =
  | { type: ActionType['ADD_TOAST']; toast: ToasterToast }
  | { type: ActionType['UPDATE_TOAST']; toast: Partial<ToasterToast> }
  | { type: ActionType['DISMISS_TOAST']; toastId?: ToasterToast['id'] }
  | { type: ActionType['REMOVE_TOAST']; toastId?: ToasterToast['id'] };

// =============================================================================
// STATE
// =============================================================================

interface State {
  toasts: ToasterToast[];
}

// =============================================================================
// ID GENERATION
// =============================================================================
// WHY A COUNTER INSTEAD OF UUID?
// ----------------------------
// - Simpler: No need for a UUID library
// - Predictable: Toast 1, Toast 2, Toast 3...
// - Good enough: Toasts are temporary, IDs just need to be unique
//
// WHY MAX_SAFE_INTEGER?
// --------------------
// JavaScript numbers are safe up to 2^53 - 1.
// The modulo ensures we never exceed this.
// =============================================================================

let count = 0;

function genId() {
  count = (count + 1) % Number.MAX_SAFE_INTEGER;
  return count.toString();
}

// =============================================================================
// TIMEOUT MANAGEMENT
// =============================================================================
// WHY A MAP OF TIMEOUTS?
// ---------------------
// Each toast needs its own timeout to auto-remove it.
// We store timeouts in a Map so we can:
//   - Cancel a timeout if the toast is manually dismissed
//   - Clean up timeasts when the component unmounts
// =============================================================================

const toastTimeouts = new Map<string, ReturnType<typeof setTimeout>>();

const addToRemoveQueue = (toastId: string) => {
  // Don't schedule removal if already scheduled
  if (toastTimeouts.has(toastId)) {
    return;
  }

  // Schedule removal after the delay
  const timeout = setTimeout(() => {
    toastTimeouts.delete(toastId);
    dispatch({
      type: 'REMOVE_TOAST',
      toastId: toastId,
    });
  }, TOAST_REMOVE_DELAY);

  toastTimeouts.set(toastId, timeout);
};

// =============================================================================
// REDUCER
// =============================================================================
// The reducer is a PURE FUNCTION: (state, action) => newState
// It never modifies the original state. It always returns a new state.
//
// WHY PURE FUNCTIONS?
// ------------------
// - Predictable: Same input → same output
// - Testable: Easy to test (no side effects)
// - Debuggable: You can replay actions to find bugs
// =============================================================================

export const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case 'ADD_TOAST':
      return {
        ...state,
        // Add new toast to the beginning, limit to TOAST_LIMIT
        toasts: [action.toast, ...state.toasts].slice(0, TOAST_LIMIT),
      };

    case 'UPDATE_TOAST':
      return {
        ...state,
        // Find the toast by ID and merge updates
        toasts: state.toasts.map((t) =>
          t.id === action.toast.id ? { ...t, ...action.toast } : t,
        ),
      };

    case 'DISMISS_TOAST': {
      const { toastId } = action;

      // Side effect: Schedule removal
      // WHY SIDE EFFECT IN A REDUCER?
      // ---------------------------
      // Technically, reducers should be pure. But scheduling a timeout
      // is a common pattern in practice. For strict purity, this would
      // be handled in a middleware.
      if (toastId) {
        addToRemoveQueue(toastId);
      } else {
        state.toasts.forEach((toast) => {
          addToRemoveQueue(toast.id);
        });
      }

      return {
        ...state,
        // Mark toast as closing (for animation)
        toasts: state.toasts.map((t) =>
          t.id === toastId || toastId === undefined
            ? { ...t, open: false }
            : t,
        ),
      };
    }

    case 'REMOVE_TOAST':
      if (action.toastId === undefined) {
        // Remove all toasts
        return { ...state, toasts: [] };
      }
      // Remove specific toast
      return {
        ...state,
        toasts: state.toasts.filter((t) => t.id !== action.toastId),
      };
  }
};

// =============================================================================
// DISPATCH & LISTENERS
// =============================================================================
// This is a simple pub/sub pattern.
// - dispatch: Sends an action to the reducer
// - listeners: Components that want to know when state changes
//
// WHY NOT USE CONTEXT?
// -------------------
// Context re-renders ALL consumers when any part of the state changes.
// This pub/sub pattern lets components subscribe to specific state slices.
// =============================================================================

const listeners: Array<(state: State) => void> = [];

let memoryState: State = { toasts: [] };

function dispatch(action: Action) {
  memoryState = reducer(memoryState, action);
  listeners.forEach((listener) => {
    listener(memoryState);
  });
}

// =============================================================================
// TOAST FUNCTION
// =============================================================================
// This is the function components call to show a toast.
//
// USAGE:
//   toast({ title: 'Success', description: 'Vehicle added' });
//   toast({ title: 'Error', description: 'Failed', variant: 'destructive' });
//
// WHAT IT RETURNS:
//   { id, dismiss, update }
//   - id: Unique ID of the toast
//   - dismiss: Function to manually close the toast
//   - update: Function to update the toast content
// =============================================================================

type Toast = Omit<ToasterToast, 'id'>;

function toast({ ...props }: Toast) {
  const id = genId();

  // Function to update this specific toast
  const update = (props: ToasterToast) =>
    dispatch({ type: 'UPDATE_TOAST', toast: { ...props, id } });

  // Function to dismiss (close) this toast
  const dismiss = () => dispatch({ type: 'DISMISS_TOAST', toastId: id });

  // Add the toast to the state
  dispatch({
    type: 'ADD_TOAST',
    toast: {
      ...props,
      id,
      open: true,
      onOpenChange: (open) => {
        if (!open) dismiss();
      },
    },
  });

  return { id, dismiss, update };
}

// =============================================================================
// useToast HOOK
// =============================================================================
// This hook gives components access to:
// - toasts: Current list of active toasts
// - toast: Function to create a new toast
// - dismiss: Function to dismiss a toast
//
// USAGE:
//   const { toast } = useToast();
//   toast({ title: 'Vehicle Added', description: 'UAX 123A is now in the fleet' });
// =============================================================================

function useToast() {
  const [state, setState] = React.useState<State>(memoryState);

  // Subscribe to state changes
  React.useEffect(() => {
    listeners.push(setState);
    return () => {
      const index = listeners.indexOf(setState);
      if (index > -1) {
        listeners.splice(index, 1);
      }
    };
  }, [state]);

  return {
    ...state,
    toast,
    dismiss: (toastId?: string) => dispatch({ type: 'DISMISS_TOAST', toastId }),
  };
}

export { useToast, toast };

// =============================================================================
// KEY CONCEPTS SUMMARY
// =============================================================================
//
// 1. Toast: Temporary popup message for user feedback
// 2. Reducer: Pure function that takes (state, action) → newState
// 3. Dispatch: Send an action to the reducer
// 4. Pub/Sub: Listeners subscribe to state changes
// 5. Auto-dismiss: Toasts remove themselves after a timeout
// 6. useToast: Hook that gives components access to toast functions
//
// WHY THIS PATTERN?
// ----------------
// - Decoupled: Any component can show a toast without prop drilling
// - Consistent: All toasts look and behave the same
// - Flexible: Easy to add new toast types (success, error, warning)
//
// =============================================================================
