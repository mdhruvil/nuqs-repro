import { createFileRoute, useLocation } from "@tanstack/react-router";
import { endOfDay, endOfWeek, startOfWeek, subDays } from "date-fns";
import { createStandardSchemaV1, parseAsTimestamp, useQueryStates } from "nuqs";

const searchParams = {
  from: parseAsTimestamp.withDefault(startOfWeek(new Date())),
  to: parseAsTimestamp.withDefault(endOfDay(new Date())),
};

export const Route = createFileRoute("/")({
  component: App,
  // THE BUG ONLY HAPPENS WHEN USING validateSearch IF I REMOVE `validateSearch` IT WORKS AS EXPECTED
  validateSearch: createStandardSchemaV1(searchParams, {
    partialOutput: true,
  }),
});

function App() {
  const [{ from, to }, setQueryStates] = useQueryStates(searchParams);
  const href = useLocation({
    select: (loc) => loc.href,
  });
  return (
    <div>
      <p>Current href: {href}</p>
      <p>From: {from?.toString()}</p>
      <p>To: {to?.toString()}</p>

      <button
        onClick={() => {
          setQueryStates({
            from: startOfWeek(subDays(new Date(), 7)),
            to: endOfWeek(subDays(new Date(), 7)),
          });
        }}
      >
        Set to Previous Week
      </button>
    </div>
  );
}
