import { useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { trpc } from "./utils/trpc";
import { httpBatchLink } from "@trpc/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "./utils/theme-provider";
import { MainLayout } from "./components/layout/main-layout";
import StartPage from "./pages/start";
import HistoryPage from "./pages/history";
import superjson from "superjson";

function App() {
    const [queryClient] = useState(() => new QueryClient());
    const [trpcClient] = useState(() =>
        trpc.createClient({
            links: [
                httpBatchLink({
                    url: "http://localhost:3000",
                    transformer: superjson,
                }),
            ],
        })
    );

    return (
        <ThemeProvider defaultTheme="system" storageKey="theme">
            <trpc.Provider client={trpcClient} queryClient={queryClient}>
                <QueryClientProvider client={queryClient}>
                    <BrowserRouter>
                        <Routes>
                            <Route path="/" element={<MainLayout />}>
                                <Route index element={<StartPage />} />
                                <Route
                                    path="history"
                                    element={<HistoryPage />}
                                />
                            </Route>
                        </Routes>
                    </BrowserRouter>
                </QueryClientProvider>
            </trpc.Provider>
        </ThemeProvider>
    );
}

export default App;
