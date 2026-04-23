## ADDED Requirements

### Requirement: shadcn CSS variables map to brand design tokens
The system SHALL remap all shadcn `:root` CSS custom properties to the brand colors defined in `DESIGN_SYSTEM.md`. All shadcn components MUST render with brand colors without per-component overrides.

#### Scenario: Primary button renders with brand blue
- **WHEN** a `<Button>` component renders with the default variant
- **THEN** its background color SHALL be `primary-500` (#3B82F6), not oklch gray

#### Scenario: Destructive button renders with error red
- **WHEN** a `<Button variant="destructive">` renders
- **THEN** its text/background SHALL use `error-500` (#DC2626)

#### Scenario: Card component uses correct background and border
- **WHEN** a `<Card>` component renders
- **THEN** its background SHALL be white and its border SHALL be `neutral-200` (#E5E7EB)

#### Scenario: Focus ring uses brand primary
- **WHEN** any interactive element (button, input) receives keyboard focus
- **THEN** the focus ring SHALL use `primary-500` (#3B82F6)

### Requirement: Dark mode block is removed
The system SHALL NOT include a `.dark` CSS block in the MVP. Only light-mode variables SHALL be defined in `:root`.

#### Scenario: No dark mode CSS present
- **WHEN** inspecting `index.css`
- **THEN** there SHALL be no `.dark` selector block
