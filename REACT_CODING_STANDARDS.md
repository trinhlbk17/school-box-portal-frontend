# React/TypeScript Coding Standards — DigiEx / BOS Frontend & Dashboard Layers

> Applies to: React applications (Admin Dashboard, Customer Portal, Partner Dashboard, Internal Tools)
> Stack: React 18+, TypeScript, Vite, TanStack Query, Zustand, React Hook Form, Zod, Tailwind CSS, Vitest, Playwright

---

## Table of Contents

1. [Documentation](#1-documentation)
2. [Early Returns & Guard Clauses](#2-early-returns--guard-clauses)
3. [Error Handling](#3-error-handling)
4. [Naming Conventions](#4-naming-conventions)
5. [Component Design](#5-component-design)
6. [Hooks](#6-hooks)
7. [State Management](#7-state-management)
8. [Type Safety](#8-type-safety)
9. [API Layer & Data Fetching](#9-api-layer--data-fetching)
10. [Forms & Validation](#10-forms--validation)
11. [Styling](#11-styling)
12. [Project Structure](#12-project-structure)
13. [Performance](#13-performance)
14. [Immutability & Pure Functions](#14-immutability--pure-functions)
15. [Security](#15-security)
16. [Testing](#16-testing)
17. [Accessibility](#17-accessibility)
18. [Quick Reference Checklist](#18-quick-reference-checklist)

---

## 1. Documentation

No inline comments — code must explain itself. Only JSDoc on exported utilities and complex hooks.

**✅ Do**

```tsx
/**
 * Formats a monetary amount for display using the account's currency.
 * Handles edge cases: zero balance, negative (overdraft), and crypto precision.
 *
 * @param amount - raw decimal string from the API (e.g. "1234.56")
 * @param currency - ISO 4217 code (e.g. "USD", "VND", "BTC")
 * @returns formatted string with currency symbol (e.g. "$1,234.56")
 */
export function formatMoney(amount: string, currency: CurrencyCode): string {
  const decimal = new Decimal(amount);
  const precision = CURRENCY_PRECISION[currency];
  return new Intl.NumberFormat(getLocale(currency), {
    style: "currency",
    currency,
    minimumFractionDigits: precision,
  }).format(decimal.toNumber());
}
```

**❌ Don't**

```tsx
// format money
export function fmt(amt: string, cur: string): string {
  // convert to number
  const n = parseFloat(amt);
  // return formatted
  return `$${n.toFixed(2)}`; // TODO: handle other currencies
}
```

---

## 2. Early Returns & Guard Clauses

Validate preconditions at the top. Avoid nested ternaries and deeply indented JSX.

**✅ Do**

```tsx
function AccountBalance({ account }: { account: Account | null }) {
  if (!account) return <EmptyState message="No account selected" />;
  if (account.status === "FROZEN") return <FrozenBanner accountId={account.id} />;
  if (account.balance.isZero()) return <ZeroBalanceCard currency={account.currency} />;

  return (
    <BalanceDisplay
      amount={account.balance}
      currency={account.currency}
      updatedAt={account.updatedAt}
    />
  );
}
```

**❌ Don't**

```tsx
function AccountBalance({ account }: { account: Account | null }) {
  return (
    <div>
      {account ? (
        account.status === "FROZEN" ? (
          <FrozenBanner accountId={account.id} />
        ) : account.balance.isZero() ? (
          <ZeroBalanceCard currency={account.currency} />
        ) : (
          <BalanceDisplay
            amount={account.balance}
            currency={account.currency}
            updatedAt={account.updatedAt}
          />
        )
      ) : (
        <EmptyState message="No account selected" />
      )}
    </div>
  );
}
```

---

## 3. Error Handling

Use React Error Boundaries at the feature level. Never let a single widget crash the entire app. Normalize all API errors into a consistent shape.

**✅ Do**

```tsx
// Domain error types — one per business scenario
type TransferError =
  | { code: "INSUFFICIENT_FUNDS"; available: string; requested: string }
  | { code: "ACCOUNT_FROZEN"; accountId: string }
  | { code: "DAILY_LIMIT_EXCEEDED"; limit: string; used: string }
  | { code: "RECIPIENT_NOT_FOUND"; identifier: string };

// Error boundary per feature
function TransferPage() {
  return (
    <FeatureErrorBoundary fallback={<TransferErrorFallback />}>
      <TransferForm />
      <RecentTransfers />
    </FeatureErrorBoundary>
  );
}

// Centralized API error normalizer
function normalizeApiError(error: unknown): AppError {
  if (error instanceof AxiosError) {
    const body = error.response?.data;
    return {
      code: body?.code ?? "UNKNOWN",
      message: body?.message ?? "An unexpected error occurred",
      statusCode: error.response?.status ?? 500,
    };
  }
  return { code: "NETWORK_ERROR", message: "Unable to reach the server", statusCode: 0 };
}
```

**❌ Don't**

```tsx
// Catching everything silently
function TransferForm() {
  async function handleSubmit() {
    try {
      await api.transfer(data);
    } catch (e) {
      console.log(e); // silent failure, user sees nothing
    }
  }
  // ...
}

// Generic string errors everywhere
throw new Error("Something went wrong");

// No error boundary — one widget crash kills the page
function TransferPage() {
  return (
    <div>
      <TransferForm />
      <RecentTransfers />
    </div>
  );
}
```

---

## 4. Naming Conventions

Consistent naming reduces cognitive load across the codebase.

### Rules

| Element | Convention | Example |
|---------|-----------|---------|
| Component | PascalCase | `AccountCard`, `TransferForm` |
| Hook | `use` + PascalCase | `useAccountBalance`, `useTransferMutation` |
| Utility function | camelCase, verb-first | `formatMoney`, `validateIban` |
| Constant | UPPER_SNAKE_CASE | `MAX_TRANSFER_AMOUNT`, `API_BASE_URL` |
| Type / Interface | PascalCase, no prefix | `Account`, `TransferRequest` |
| Enum | PascalCase name, UPPER_SNAKE keys | `AccountStatus.ACTIVE` |
| Event handler prop | `on` + Event | `onTransferComplete`, `onAccountSelect` |
| Event handler impl | `handle` + Event | `handleTransferComplete`, `handleAccountSelect` |
| Boolean state/prop | `is/has/should/can` | `isLoading`, `hasOverdraft`, `canTransfer` |
| File — component | PascalCase.tsx | `AccountCard.tsx` |
| File — hook | camelCase.ts | `useAccountBalance.ts` |
| File — utility | camelCase.ts | `formatMoney.ts` |
| File — type | camelCase.types.ts | `account.types.ts` |
| File — test | `*.test.tsx` | `AccountCard.test.tsx` |

**✅ Do**

```tsx
// Boolean props read naturally in JSX
<TransferButton isDisabled={!canTransfer} isLoading={isSubmitting} />

// Event naming: on* for props, handle* for implementations
interface TransferFormProps {
  onTransferComplete: (result: TransferResult) => void;
  onCancel: () => void;
}

function TransferForm({ onTransferComplete, onCancel }: TransferFormProps) {
  function handleSubmit(data: TransferInput) {
    const result = await executeTransfer(data);
    onTransferComplete(result);
  }
  // ...
}
```

**❌ Don't**

```tsx
// Prefixed interfaces — TypeScript doesn't need Hungarian notation
interface IAccount { ... }
type TTransferRequest = { ... };

// Ambiguous boolean
<TransferButton disabled={transfer} loading={submit} />

// Generic names
function Component1() { ... }
const data = useFetch("/accounts");
const info = getStuff();

// Utils/Helper/Manager — vague containers
export class AccountUtils { ... }
export class TransferHelper { ... }
```

---

## 5. Component Design

Components should be small, focused, and composable. One component = one responsibility.

**✅ Do**

```tsx
// Small, focused — each component has one job
function TransferSummary({ transfer }: { transfer: Transfer }) {
  return (
    <Card>
      <CardHeader>
        <TransferStatusBadge status={transfer.status} />
      </CardHeader>
      <CardBody>
        <MoneyDisplay amount={transfer.amount} currency={transfer.currency} />
        <AccountLabel account={transfer.sourceAccount} role="from" />
        <AccountLabel account={transfer.destinationAccount} role="to" />
      </CardBody>
      <CardFooter>
        <RelativeTime date={transfer.createdAt} />
      </CardFooter>
    </Card>
  );
}

// Props interface — explicit, typed, documented by shape
interface TransferListProps {
  accountId: string;
  limit?: number;
  onTransferSelect: (transfer: Transfer) => void;
}

// Compound components for complex UI
<DataTable data={transfers} columns={transferColumns}>
  <DataTable.Header />
  <DataTable.Body />
  <DataTable.Pagination />
</DataTable>
```

**❌ Don't**

```tsx
// God component — does everything
function TransferPage() {
  const [transfers, setTransfers] = useState([]);
  const [selectedTransfer, setSelectedTransfer] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const [errors, setErrors] = useState({});
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState({});
  // ... 400 lines of mixed concerns

  return (
    <div>
      {/* 200 lines of JSX mixing list, detail, form, pagination, filters */}
    </div>
  );
}

// Prop drilling through many layers
<App account={account}>
  <Layout account={account}>
    <Sidebar account={account}>
      <AccountName account={account} />
    </Sidebar>
  </Layout>
</App>
```

---

## 6. Hooks

Custom hooks encapsulate reusable logic. They should be pure, composable, and follow the single-responsibility principle.

**✅ Do**

```tsx
// One hook = one concern
function useAccountBalance(accountId: string) {
  return useQuery({
    queryKey: ["account", accountId, "balance"],
    queryFn: () => accountApi.getBalance(accountId),
    refetchInterval: 30_000,
    select: (data) => ({
      amount: new Decimal(data.balance),
      currency: data.currency,
      updatedAt: new Date(data.updatedAt),
    }),
  });
}

// Compose hooks for complex logic
function useTransferEligibility(sourceAccountId: string, amount: Decimal) {
  const { data: balance } = useAccountBalance(sourceAccountId);
  const { data: limits } = useDailyTransferLimits(sourceAccountId);

  const canTransfer = useMemo(() => {
    if (!balance || !limits) return false;
    if (balance.amount.lessThan(amount)) return false;
    if (limits.remaining.lessThan(amount)) return false;
    return true;
  }, [balance, limits, amount]);

  const reason = useMemo((): TransferBlockReason | null => {
    if (!balance) return null;
    if (balance.amount.lessThan(amount)) return "INSUFFICIENT_FUNDS";
    if (limits && limits.remaining.lessThan(amount)) return "DAILY_LIMIT_EXCEEDED";
    return null;
  }, [balance, limits, amount]);

  return { canTransfer, reason };
}
```

**❌ Don't**

```tsx
// Hook doing too many things
function useEverything() {
  const [user, setUser] = useState(null);
  const [accounts, setAccounts] = useState([]);
  const [transfers, setTransfers] = useState([]);
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    fetchUser().then(setUser);
    fetchAccounts().then(setAccounts);
    fetchTransfers().then(setTransfers);
    fetchNotifications().then(setNotifications);
  }, []);

  return { user, accounts, transfers, notifications };
}

// useEffect for data fetching (use TanStack Query instead)
function useAccountBalance(accountId: string) {
  const [balance, setBalance] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    accountApi.getBalance(accountId)
      .then(setBalance)
      .catch(setError)
      .finally(() => setLoading(false));
  }, [accountId]);

  return { balance, loading, error };
}
```

---

## 7. State Management

Classify state by type and use the right tool for each.

| State Type | Tool | Example |
|-----------|------|---------|
| Server/async | TanStack Query | Account list, transfer history, KYC status |
| URL state | Search params / router | Current page, filters, sort order, selected tab |
| Form state | React Hook Form | Transfer form, profile editor, KYC form |
| Global client | Zustand | Auth session, theme, sidebar collapsed |
| Local UI | useState | Tooltip open, dropdown expanded, input focus |

**✅ Do**

```tsx
// Server state — TanStack Query (never useState + useEffect)
const { data: accounts } = useQuery({
  queryKey: ["accounts", { status: "ACTIVE" }],
  queryFn: () => accountApi.list({ status: "ACTIVE" }),
});

// URL as state — filters survive refresh and are shareable
function useTransferFilters() {
  const [searchParams, setSearchParams] = useSearchParams();
  return {
    status: searchParams.get("status") as TransferStatus | null,
    dateFrom: searchParams.get("from"),
    dateTo: searchParams.get("to"),
    setFilters: (filters: TransferFilters) =>
      setSearchParams(toSearchParams(filters), { replace: true }),
  };
}

// Global client state — minimal, with Zustand
interface AuthStore {
  session: Session | null;
  setSession: (session: Session | null) => void;
  logout: () => void;
}

const useAuthStore = create<AuthStore>((set) => ({
  session: null,
  setSession: (session) => set({ session }),
  logout: () => {
    set({ session: null });
    queryClient.clear();
  },
}));
```

**❌ Don't**

```tsx
// Server data in global store — stale, no cache, no refetch
const useStore = create((set) => ({
  accounts: [],
  fetchAccounts: async () => {
    const data = await api.getAccounts();
    set({ accounts: data });
  },
}));

// Everything in one giant context
const AppContext = createContext({
  user: null,
  accounts: [],
  transfers: [],
  notifications: [],
  theme: "light",
  sidebar: true,
  filters: {},
  // ... 30 more fields — every consumer re-renders on any change
});

// Derived state stored separately (compute instead)
const [items, setItems] = useState([]);
const [total, setTotal] = useState(0);

function addItem(item: Item) {
  setItems((prev) => [...prev, item]);
  setTotal((prev) => prev + item.amount); // easy to go out of sync
}
```

---

## 8. Type Safety

TypeScript `strict: true` is non-negotiable. No `any`. No `as` type assertions without explicit justification.

**✅ Do**

```tsx
// Discriminated unions for API responses
type ApiResponse<T> =
  | { status: "success"; data: T }
  | { status: "error"; error: AppError };

// Exhaustive handling with assertNever
function renderTransferStatus(status: TransferStatus) {
  switch (status) {
    case "PENDING": return <Badge variant="warning">Pending</Badge>;
    case "PROCESSING": return <Badge variant="info">Processing</Badge>;
    case "COMPLETED": return <Badge variant="success">Completed</Badge>;
    case "FAILED": return <Badge variant="destructive">Failed</Badge>;
    case "REVERSED": return <Badge variant="outline">Reversed</Badge>;
    default: return assertNever(status);
  }
}

// Const assertion for static config
const TRANSFER_LIMITS = {
  INTERNAL: { daily: 500_000_000, perTransaction: 100_000_000 },
  EXTERNAL: { daily: 200_000_000, perTransaction: 50_000_000 },
} as const satisfies Record<TransferType, TransferLimit>;

// Generic components with proper constraints
interface DataTableProps<T extends { id: string }> {
  data: T[];
  columns: ColumnDef<T>[];
  onRowClick?: (item: T) => void;
}

function DataTable<T extends { id: string }>({ data, columns, onRowClick }: DataTableProps<T>) {
  // ...
}
```

**❌ Don't**

```tsx
// any — disables type checking entirely
function processResponse(data: any) {
  return data.result.items.map((x: any) => x.name);
}

// Unsafe assertion without validation
const account = JSON.parse(raw) as Account; // could be anything at runtime

// Loose types that don't help
interface Props {
  data: object;
  config: Record<string, unknown>;
  callback: Function;
}

// Enum misuse — prefer union types or const objects
enum Status {
  Active = "active",    // enums have quirks in TS — tree-shaking, reverse mapping
  Inactive = "inactive",
}

// Prefer:
type Status = "ACTIVE" | "INACTIVE";
// or:
const STATUS = { ACTIVE: "ACTIVE", INACTIVE: "INACTIVE" } as const;
type Status = (typeof STATUS)[keyof typeof STATUS];
```

---

## 9. API Layer & Data Fetching

Centralize all API calls. Auto-generate types from backend OpenAPI spec. Never call `fetch` or `axios` directly in components.

**✅ Do**

```tsx
// Centralized API client with interceptors
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  timeout: 15_000,
});

apiClient.interceptors.request.use((config) => {
  const token = useAuthStore.getState().session?.accessToken;
  if (token) config.headers.Authorization = `Bearer ${token}`;
  config.headers["X-Request-ID"] = generateRequestId();
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      await refreshTokenOrLogout();
    }
    return Promise.reject(normalizeApiError(error));
  },
);

// API module per domain
const accountApi = {
  list: (params: AccountListParams) =>
    apiClient.get<PaginatedResponse<Account>>("/accounts", { params }).then((r) => r.data),

  getById: (id: string) =>
    apiClient.get<Account>(`/accounts/${id}`).then((r) => r.data),

  freeze: (id: string, reason: FreezeReason) =>
    apiClient.post<Account>(`/accounts/${id}/freeze`, { reason }).then((r) => r.data),
};

// Query hooks wrap the API module
function useAccount(accountId: string) {
  return useQuery({
    queryKey: ["accounts", accountId],
    queryFn: () => accountApi.getById(accountId),
    staleTime: 5 * 60 * 1000,
  });
}

// Mutations with optimistic updates and cache invalidation
function useTransferMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: transferApi.execute,
    onSuccess: (result) => {
      queryClient.invalidateQueries({ queryKey: ["accounts", result.sourceAccountId] });
      queryClient.invalidateQueries({ queryKey: ["transfers"] });
      toast.success(`Transfer ${result.reference} completed`);
    },
    onError: (error: AppError) => {
      toast.error(TRANSFER_ERROR_MESSAGES[error.code] ?? "Transfer failed");
    },
  });
}
```

**❌ Don't**

```tsx
// Fetching directly in component
function AccountList() {
  const [accounts, setAccounts] = useState([]);

  useEffect(() => {
    fetch("/api/accounts", {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    })
      .then((r) => r.json())
      .then(setAccounts);
  }, []);
  // no loading, no error handling, no caching, no type safety
}

// Duplicated fetch logic across components
function AccountPage() {
  const [account, setAccount] = useState(null);
  useEffect(() => {
    axios.get(`/api/accounts/${id}`).then((r) => setAccount(r.data));
  }, [id]);
}

function AccountHeader() {
  const [account, setAccount] = useState(null);
  useEffect(() => {
    axios.get(`/api/accounts/${id}`).then((r) => setAccount(r.data)); // same call, different cache
  }, [id]);
}
```

---

## 10. Forms & Validation

React Hook Form + Zod for schema-based validation. Validate at the form boundary — components below receive clean data.

**✅ Do**

```tsx
// Zod schema = single source of truth for validation
const transferSchema = z.object({
  sourceAccountId: z.string().ulid("Invalid source account"),
  destinationAccountId: z.string().ulid("Invalid destination account"),
  amount: z
    .string()
    .refine((v) => new Decimal(v).greaterThan(0), "Amount must be positive")
    .refine((v) => new Decimal(v).decimalPlaces() <= 2, "Max 2 decimal places"),
  currency: z.enum(["USD", "EUR", "VND", "SGD"]),
  reference: z.string().max(140).optional(),
  idempotencyKey: z.string().uuid(),
});

type TransferInput = z.infer<typeof transferSchema>;

function TransferForm({ onSubmit }: { onSubmit: (data: TransferInput) => void }) {
  const form = useForm<TransferInput>({
    resolver: zodResolver(transferSchema),
    defaultValues: {
      idempotencyKey: crypto.randomUUID(),
    },
  });

  return (
    <form onSubmit={form.handleSubmit(onSubmit)}>
      <FormField
        control={form.control}
        name="sourceAccountId"
        render={({ field }) => (
          <AccountSelect {...field} label="From Account" />
        )}
      />
      <FormField
        control={form.control}
        name="amount"
        render={({ field }) => (
          <MoneyInput {...field} label="Amount" currency={form.watch("currency")} />
        )}
      />
      <Button type="submit" isLoading={form.formState.isSubmitting}>
        Confirm Transfer
      </Button>
    </form>
  );
}
```

**❌ Don't**

```tsx
// Manual validation scattered in handler
function TransferForm() {
  const [amount, setAmount] = useState("");
  const [error, setError] = useState("");

  function handleSubmit() {
    if (!amount) { setError("Required"); return; }
    if (parseFloat(amount) <= 0) { setError("Must be positive"); return; }
    if (amount.split(".")[1]?.length > 2) { setError("Max 2 decimals"); return; }
    // ... more manual checks
    api.transfer({ amount });
  }

  return (
    <div>
      <input value={amount} onChange={(e) => setAmount(e.target.value)} />
      {error && <span style={{ color: "red" }}>{error}</span>}
      <button onClick={handleSubmit}>Submit</button>
    </div>
  );
}
```

---

## 11. Styling

Use Tailwind CSS with a design token system. No inline style objects. No CSS-in-JS runtime.

**✅ Do**

```tsx
// Tailwind with consistent design tokens (tailwind.config.ts)
export default {
  theme: {
    extend: {
      colors: {
        brand: { 50: "#f0f7ff", 500: "#2563eb", 900: "#1e3a5f" },
        success: { 500: "#16a34a" },
        danger: { 500: "#dc2626" },
      },
      spacing: { "4.5": "1.125rem" },
    },
  },
} satisfies Config;

// Variant-based component with cva (class-variance-authority)
const badgeVariants = cva(
  "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium",
  {
    variants: {
      status: {
        ACTIVE: "bg-success-50 text-success-700",
        FROZEN: "bg-danger-50 text-danger-700",
        PENDING_KYC: "bg-yellow-50 text-yellow-700",
        CLOSED: "bg-gray-100 text-gray-600",
      },
    },
  },
);

function AccountStatusBadge({ status }: { status: AccountStatus }) {
  return <span className={badgeVariants({ status })}>{ACCOUNT_STATUS_LABELS[status]}</span>;
}

// cn utility for conditional classes
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

<Button className={cn("w-full", isCompact && "w-auto")} />
```

**❌ Don't**

```tsx
// Inline styles — not responsive, no hover/focus, not cacheable
<div style={{ padding: 16, backgroundColor: status === "ACTIVE" ? "green" : "red" }}>
  {account.name}
</div>

// Magic color values scattered in JSX
<span className="text-[#2e75b6] bg-[#f0f7ff] border-[#d5e8f0]">Active</span>

// String concatenation for classes
<div className={"card " + (isActive ? "card-active" : "") + " " + (isLarge ? "card-lg" : "")}>
```

---

## 12. Project Structure

Feature-based folder structure. Group by domain context, not by file type.

**✅ Do**

```
src/
├── app/                          # App shell, routing, providers
│   ├── routes/                   # Route definitions
│   ├── providers.tsx             # Composed providers (query, auth, theme)
│   └── App.tsx
│
├── features/                     # Feature modules (bounded contexts)
│   ├── account/
│   │   ├── api/                  # accountApi.ts
│   │   ├── components/           # AccountCard.tsx, AccountList.tsx
│   │   ├── hooks/                # useAccount.ts, useAccountBalance.ts
│   │   ├── types/                # account.types.ts
│   │   └── index.ts              # Public API — only export what others need
│   │
│   ├── transfer/
│   │   ├── api/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── schemas/              # transferSchema.ts (Zod)
│   │   ├── types/
│   │   └── index.ts
│   │
│   └── kyc/
│       ├── api/
│       ├── components/
│       ├── hooks/
│       ├── types/
│       └── index.ts
│
├── shared/                       # Truly shared, domain-agnostic
│   ├── components/               # Button, Card, DataTable, Modal
│   ├── hooks/                    # useDebounce, useLocalStorage
│   ├── lib/                      # apiClient.ts, formatMoney.ts, cn.ts
│   ├── types/                    # api.types.ts, common.types.ts
│   └── constants/                # currencies.ts, routes.ts
│
└── test/                         # Test utilities and factories
    ├── factories/                # accountFactory.ts, transferFactory.ts
    ├── handlers/                 # MSW handlers
    └── setup.ts                  # Vitest global setup
```

**❌ Don't**

```
src/
├── components/        # 200 files, no organization
│   ├── AccountCard.tsx
│   ├── TransferForm.tsx
│   ├── Button.tsx
│   ├── KycStep1.tsx
│   └── ...
├── hooks/             # all hooks dumped together
├── services/          # all API calls dumped together
├── types/             # all types dumped together
├── utils/             # everything else
└── pages/             # thin wrappers importing from everywhere
```

### Import Rules

```tsx
// ✅ Import from feature public API
import { AccountCard, useAccount } from "@/features/account";

// ❌ Reach into feature internals
import { AccountCard } from "@/features/account/components/AccountCard";

// ✅ Cross-feature dependency flows through shared or via props
import { formatMoney } from "@/shared/lib/formatMoney";

// ❌ Feature imports from another feature's internals
import { useTransferMutation } from "@/features/transfer/hooks/useTransferMutation";
```

---

## 13. Performance

Don't prematurely optimize. Profile first. But follow these structural patterns to avoid common pitfalls.

**✅ Do**

```tsx
// Lazy-load routes
const AccountPage = lazy(() => import("@/features/account/pages/AccountPage"));
const TransferPage = lazy(() => import("@/features/transfer/pages/TransferPage"));

function AppRoutes() {
  return (
    <Suspense fallback={<PageSkeleton />}>
      <Routes>
        <Route path="/accounts" element={<AccountPage />} />
        <Route path="/transfers" element={<TransferPage />} />
      </Routes>
    </Suspense>
  );
}

// Memoize expensive computations — only when profiler confirms the need
function TransferHistory({ transfers }: { transfers: Transfer[] }) {
  const groupedByDate = useMemo(
    () => groupTransfersByDate(transfers),
    [transfers],
  );
  // ...
}

// Virtualize long lists
import { useVirtualizer } from "@tanstack/react-virtual";

function TransactionList({ transactions }: { transactions: Transaction[] }) {
  const parentRef = useRef<HTMLDivElement>(null);
  const virtualizer = useVirtualizer({
    count: transactions.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 64,
  });
  // ...
}

// Stable references for callbacks passed to memoized children
const handleSelect = useCallback(
  (id: string) => router.push(`/accounts/${id}`),
  [router],
);
```

**❌ Don't**

```tsx
// useMemo/useCallback on everything (premature optimization)
const name = useMemo(() => `${first} ${last}`, [first, last]); // string concat is cheap
const handleClick = useCallback(() => setOpen(true), []); // not passed to memoized child

// Inline object/array creation causing re-renders in memoized children
<MemoizedTable
  columns={[col1, col2, col3]}              // new array every render
  style={{ padding: 16 }}                    // new object every render
  onRowClick={(row) => selectRow(row)}       // new function every render
/>

// Fetching all data upfront
const allTransactions = await api.getAllTransactions(); // 100K records?
```

---

## 14. Immutability & Pure Functions

Never mutate state or props directly. Prefer functional transformations.

**✅ Do**

```tsx
// Immutable state updates
function useTransferList() {
  const [transfers, setTransfers] = useState<Transfer[]>([]);

  function addTransfer(transfer: Transfer) {
    setTransfers((prev) => [...prev, transfer]);
  }

  function removeTransfer(id: string) {
    setTransfers((prev) => prev.filter((t) => t.id !== id));
  }

  function updateStatus(id: string, status: TransferStatus) {
    setTransfers((prev) =>
      prev.map((t) => (t.id === id ? { ...t, status } : t)),
    );
  }

  return { transfers, addTransfer, removeTransfer, updateStatus };
}

// Pure utility functions — no side effects, same input → same output
function calculateTransferFee(amount: Decimal, type: TransferType): Decimal {
  const rate = TRANSFER_FEE_RATES[type];
  const fee = amount.mul(rate);
  const minimum = MINIMUM_FEES[type];
  return Decimal.max(fee, minimum);
}

// Readonly types for props
interface AccountDetailProps {
  readonly account: Account;
  readonly transactions: readonly Transaction[];
}
```

**❌ Don't**

```tsx
// Mutating state directly
function handleApprove(transfer: Transfer) {
  transfer.status = "APPROVED"; // mutating prop
  transfers.push(transfer);      // mutating array
  setTransfers(transfers);       // same reference, React won't re-render
}

// Side effects in render
function AccountBalance({ accountId }: { accountId: string }) {
  localStorage.setItem("lastViewed", accountId); // side effect in render!
  analyticsTrack("balance_viewed");               // side effect in render!
  return <div>...</div>;
}

// Impure utility
let callCount = 0;
function calculateFee(amount: number) {
  callCount++; // external mutation
  return amount * 0.01;
}
```

---

## 15. Security

Frontend is an untrusted environment. Never trust client-side validation alone. Never store secrets in code.

**✅ Do**

```tsx
// Sanitize dynamic HTML (rare, but necessary for rich text from CMS)
import DOMPurify from "dompurify";

function RichContent({ html }: { html: string }) {
  const sanitized = DOMPurify.sanitize(html, { ALLOWED_TAGS: ["p", "b", "i", "a", "ul", "li"] });
  return <div dangerouslySetInnerHTML={{ __html: sanitized }} />;
}

// Environment variables — typed and validated at startup
const envSchema = z.object({
  VITE_API_BASE_URL: z.string().url(),
  VITE_AUTH_DOMAIN: z.string(),
  VITE_SENTRY_DSN: z.string().optional(),
});

export const env = envSchema.parse(import.meta.env);

// Auth tokens — httpOnly cookies (set by backend), not localStorage
// Frontend only reads auth state from API response, never stores tokens directly

// Sensitive data masking in logs
function maskPan(pan: string): string {
  return `****${pan.slice(-4)}`;
}

function maskEmail(email: string): string {
  const [local, domain] = email.split("@");
  return `${local[0]}***@${domain}`;
}
```

**❌ Don't**

```tsx
// Tokens in localStorage — XSS can steal them
localStorage.setItem("accessToken", token);
localStorage.setItem("refreshToken", refreshToken);

// API keys in frontend code
const apiKey = "sk_live_abc123"; // bundled in client JS, visible to everyone

// Unescaped dynamic content
<div dangerouslySetInnerHTML={{ __html: userInput }} /> // XSS vector

// Client-only authorization (easily bypassed)
{user.role === "admin" && <AdminPanel />}
// The route and API must also check — hiding the button is not security
```

---

## 16. Testing

Test behavior, not implementation. Use factories for test data. MSW for API mocking.

### Test Structure

| Layer | Tool | What to Test |
|-------|------|-------------|
| Unit | Vitest | Pure functions, hooks, utility logic |
| Component | Vitest + Testing Library | User interactions, conditional rendering |
| Integration | Vitest + MSW | Feature flows with mocked API |
| E2E | Playwright | Critical user journeys (login, transfer, KYC) |

### Naming Convention

```
should_[expectedBehavior]_when_[condition]
```

**✅ Do**

```tsx
// Test data factory — consistent, customizable
function createAccount(overrides?: Partial<Account>): Account {
  return {
    id: `acct_${ulid()}`,
    userId: `usr_${ulid()}`,
    currency: "USD",
    status: "ACTIVE",
    balance: "1000.00",
    createdAt: new Date().toISOString(),
    ...overrides,
  };
}

// Component test — test what the user sees and does
describe("TransferForm", () => {
  it("should_disableSubmit_when_amountExceedsBalance", async () => {
    const account = createAccount({ balance: "100.00" });

    render(<TransferForm sourceAccount={account} onSubmit={vi.fn()} />);

    await userEvent.type(screen.getByLabelText("Amount"), "500.00");
    await userEvent.click(screen.getByRole("button", { name: "Confirm Transfer" }));

    expect(screen.getByText("Insufficient funds")).toBeInTheDocument();
  });

  it("should_callOnSubmit_when_validTransfer", async () => {
    const account = createAccount({ balance: "10000.00" });
    const onSubmit = vi.fn();

    render(<TransferForm sourceAccount={account} onSubmit={onSubmit} />);

    await userEvent.type(screen.getByLabelText("Amount"), "500.00");
    await userEvent.click(screen.getByRole("button", { name: "Confirm Transfer" }));

    expect(onSubmit).toHaveBeenCalledWith(
      expect.objectContaining({ amount: "500.00" }),
    );
  });
});

// Hook test — isolated logic testing
describe("useTransferEligibility", () => {
  it("should_returnCanTransferFalse_when_balanceInsufficient", () => {
    const { result } = renderHook(() =>
      useTransferEligibility("acct_123", new Decimal("5000")),
    );

    expect(result.current.canTransfer).toBe(false);
    expect(result.current.reason).toBe("INSUFFICIENT_FUNDS");
  });
});

// MSW handler for integration tests
const handlers = [
  http.get("/api/accounts/:id", ({ params }) => {
    return HttpResponse.json(createAccount({ id: params.id as string }));
  }),
  http.post("/api/transfers", async ({ request }) => {
    const body = await request.json();
    return HttpResponse.json(createTransfer(body as TransferInput));
  }),
];
```

**❌ Don't**

```tsx
// Testing implementation details
it("should call useState with initial value", () => {
  const spy = vi.spyOn(React, "useState");
  render(<AccountBalance />);
  expect(spy).toHaveBeenCalledWith(null);
});

// Snapshot tests as primary testing strategy
it("matches snapshot", () => {
  const { container } = render(<TransferForm />);
  expect(container).toMatchSnapshot(); // breaks on every style change, tests nothing specific
});

// No test isolation — tests depend on order
let sharedAccount: Account;
beforeAll(() => { sharedAccount = createAccount(); });
it("test 1", () => { sharedAccount.status = "FROZEN"; });
it("test 2", () => { /* depends on test 1 mutating sharedAccount */ });

// Logic inside tests
it("should calculate fees", () => {
  for (const type of transferTypes) {
    if (type === "INTERNAL") {
      expect(calculateFee(100, type)).toBe(0);
    } else {
      expect(calculateFee(100, type)).toBeGreaterThan(0);
    }
  }
});
// Better: separate test per scenario
```

---

## 17. Accessibility

Accessible by default. Use semantic HTML. Test with keyboard navigation.

**✅ Do**

```tsx
// Semantic HTML — button for actions, a for navigation
<button onClick={handleTransfer} disabled={!canTransfer}>
  Confirm Transfer
</button>

<a href={`/accounts/${account.id}`}>View Account</a>

// ARIA for custom components
function MoneyInput({ label, ...props }: MoneyInputProps) {
  const id = useId();
  const errorId = `${id}-error`;

  return (
    <div>
      <label htmlFor={id}>{label}</label>
      <input
        id={id}
        type="text"
        inputMode="decimal"
        aria-invalid={!!props.error}
        aria-describedby={props.error ? errorId : undefined}
        {...props}
      />
      {props.error && (
        <p id={errorId} role="alert">
          {props.error}
        </p>
      )}
    </div>
  );
}

// Loading states announced to screen readers
<div aria-live="polite" aria-busy={isLoading}>
  {isLoading ? <Skeleton /> : <AccountList accounts={accounts} />}
</div>

// Focus management after actions
function TransferConfirmation({ onClose }: { onClose: () => void }) {
  const closeRef = useRef<HTMLButtonElement>(null);
  useEffect(() => { closeRef.current?.focus(); }, []);

  return (
    <Dialog onClose={onClose}>
      <p>Transfer completed successfully.</p>
      <button ref={closeRef} onClick={onClose}>Close</button>
    </Dialog>
  );
}
```

**❌ Don't**

```tsx
// div for everything
<div onClick={handleTransfer}>Confirm Transfer</div>  // not focusable, no keyboard support
<div onClick={() => navigate("/accounts")}>View</div>  // not a link, not navigable

// Missing labels
<input type="text" placeholder="Amount" /> // placeholder is not a label

// Color as only indicator
<span style={{ color: status === "FAILED" ? "red" : "green" }}>{status}</span>
// Screen reader only sees "FAILED", sighted user with color blindness may miss it
// Add icon or text label alongside color
```

---

## 18. Quick Reference Checklist

```
DOCUMENTATION
  ✓ No inline comments — JSDoc on exported utils and complex hooks only
  ✓ Code is self-explanatory; refactor before adding a comment

CONTROL FLOW
  ✓ Early returns / guard clauses — happy path stays unindented
  ✓ No nested ternaries in JSX — extract to early returns or subcomponents

ERROR HANDLING
  ✓ FeatureErrorBoundary wraps each feature section
  ✓ Centralized API error normalizer — one shape for all errors
  ✓ Domain error types — discriminated unions per feature
  ✓ Toast/notification for user-facing errors

NAMING
  ✓ PascalCase components, use* hooks, camelCase utils, UPPER_SNAKE constants
  ✓ on* for callback props, handle* for implementations
  ✓ Boolean: is/has/should/can prefix
  ✓ No abbreviations — descriptive names always
  ✓ Ban *Utils/*Helper/*Manager — name by what it does

COMPONENT DESIGN
  ✓ One component = one responsibility
  ✓ Props interface — explicit, typed, no any
  ✓ Composition over configuration — compound components for complex UI

STATE MANAGEMENT
  ✓ Server state → TanStack Query (never useState + useEffect for fetching)
  ✓ URL state → searchParams (filters, pagination, tabs)
  ✓ Form state → React Hook Form + Zod
  ✓ Global client → Zustand (auth, theme only)
  ✓ Local UI → useState

TYPE SAFETY
  ✓ strict: true — no exceptions
  ✓ No any — use unknown + narrowing
  ✓ No unsafe as assertions — validate at runtime boundaries
  ✓ Exhaustive switch — assertNever for discriminated unions
  ✓ Union types over enums

API LAYER
  ✓ Centralized API client with interceptors
  ✓ API module per domain (accountApi, transferApi)
  ✓ Types auto-generated from OpenAPI spec
  ✓ Never call fetch/axios directly in components

FORMS
  ✓ Zod schema = single source of truth
  ✓ React Hook Form + zodResolver
  ✓ Validate at form boundary only

STYLING
  ✓ Tailwind + design tokens — no inline styles
  ✓ cva for variant-based components
  ✓ cn() utility for conditional classes
  ✓ No magic color values — use token system

PROJECT STRUCTURE
  ✓ Feature-based folders (account/, transfer/, kyc/)
  ✓ Import from feature public API (index.ts)
  ✓ No cross-feature internal imports
  ✓ shared/ for truly domain-agnostic code only

PERFORMANCE
  ✓ Lazy-load routes
  ✓ Virtualize lists > 100 items
  ✓ Profile before memoizing — don't useMemo everything
  ✓ Stable references for memoized child props

IMMUTABILITY
  ✓ Never mutate state or props
  ✓ Functional array operations (map/filter/spread)
  ✓ readonly types for component props
  ✓ No side effects in render

SECURITY
  ✓ DOMPurify for any dynamic HTML
  ✓ No tokens in localStorage — httpOnly cookies
  ✓ No secrets in client code
  ✓ Typed + validated environment variables
  ✓ Mask PII in logs (PAN, email, phone)

TESTING
  ✓ Naming: should_[expected]_when_[condition]
  ✓ Test behavior, not implementation
  ✓ Factory functions for test data — no hardcoded fixtures
  ✓ MSW for API mocking
  ✓ No logic in tests — no if/for/try
  ✓ One logical assertion per test
  ✓ No snapshot tests as primary strategy

ACCESSIBILITY
  ✓ Semantic HTML — button for actions, a for navigation
  ✓ Labels on all inputs — placeholder is not a label
  ✓ ARIA for custom interactive components
  ✓ Focus management after modal/dialog actions
  ✓ Color is never the only indicator
```

---

**Last Updated**: 2026-04-01
**Version**: 1.0
**Companion Documents**: `CODING_RULE.md` (general), `JAVA_CODING_STANDARDS.md`, `NESTJS_CODING_STANDARDS.md`
