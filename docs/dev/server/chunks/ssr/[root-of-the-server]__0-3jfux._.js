module.exports = [
"[externals]/next/dist/compiled/next-server/app-page-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-page-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[project]/src/utils/storage.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "clearState",
    ()=>clearState,
    "loadState",
    ()=>loadState,
    "saveState",
    ()=>saveState
]);
const STORAGE_KEY = "brainstormer-state";
const CURRENT_VERSION = 1;
function loadState() {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (!raw) return null;
        const parsed = JSON.parse(raw);
        if (parsed.version !== CURRENT_VERSION) {
            clearState();
            return null;
        }
        return parsed.data;
    } catch  {
        clearState();
        return null;
    }
}
function saveState(state) {
    try {
        const payload = {
            version: CURRENT_VERSION,
            savedAt: Date.now(),
            data: state
        };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
    } catch  {}
}
function clearState() {
    try {
        localStorage.removeItem(STORAGE_KEY);
    } catch  {}
}
}),
"[project]/src/utils/colors.ts [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "STICKY_COLORS",
    ()=>STICKY_COLORS,
    "getRandomStickyColor",
    ()=>getRandomStickyColor
]);
const STICKY_COLORS = [
    {
        bg: "#FEF3C7",
        border: "#F59E0B",
        text: "#92400E"
    },
    {
        bg: "#D1FAE5",
        border: "#10B981",
        text: "#065F46"
    },
    {
        bg: "#DBEAFE",
        border: "#3B82F6",
        text: "#1E40AF"
    },
    {
        bg: "#FCE7F3",
        border: "#EC4899",
        text: "#9D174D"
    },
    {
        bg: "#FFEDD5",
        border: "#F97316",
        text: "#9A3412"
    },
    {
        bg: "#F3E8FF",
        border: "#A855F7",
        text: "#6B21A8"
    },
    {
        bg: "#CCFBF1",
        border: "#14B8A6",
        text: "#115E59"
    },
    {
        bg: "#FFE4E6",
        border: "#F43F5E",
        text: "#9F1239"
    },
    {
        bg: "#E0E7FF",
        border: "#6366F1",
        text: "#3730A3"
    },
    {
        bg: "#FEF9C3",
        border: "#EAB308",
        text: "#854D0E"
    }
];
function getRandomStickyColor() {
    return STICKY_COLORS[Math.floor(Math.random() * STICKY_COLORS.length)];
}
}),
"[project]/src/context/BrainstormContext.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "BrainstormProvider",
    ()=>BrainstormProvider,
    "useBrainstorm",
    ()=>useBrainstorm
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$storage$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/utils/storage.ts [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$colors$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/utils/colors.ts [app-ssr] (ecmascript)");
"use client";
;
;
;
;
const initialState = {
    phase: "setup",
    situationDescription: "",
    relationshipDynamics: "",
    interests: "",
    attendees: [],
    ideas: [],
    discardedIdeaIds: []
};
function brainstormReducer(state, action) {
    switch(action.type){
        case "SET_SITUATION":
            return {
                ...state,
                situationDescription: action.payload
            };
        case "SET_RELATIONSHIP_DYNAMICS":
            return {
                ...state,
                relationshipDynamics: action.payload
            };
        case "SET_INTERESTS":
            return {
                ...state,
                interests: action.payload
            };
        case "ADD_ATTENDEE":
            {
                const trimmed = action.payload.trim();
                if (!trimmed) return state;
                const newAttendee = {
                    id: crypto.randomUUID(),
                    name: trimmed,
                    isMediator: state.attendees.length === 0
                };
                return {
                    ...state,
                    attendees: [
                        ...state.attendees,
                        newAttendee
                    ]
                };
            }
        case "REMOVE_ATTENDEE":
            {
                const filtered = state.attendees.filter((a)=>a.id !== action.payload);
                const hadMediator = state.attendees.find((a)=>a.id === action.payload)?.isMediator;
                if (hadMediator && filtered.length > 0) {
                    filtered[0].isMediator = true;
                }
                return {
                    ...state,
                    attendees: filtered
                };
            }
        case "SET_MEDIATOR":
            return {
                ...state,
                attendees: state.attendees.map((a)=>({
                        ...a,
                        isMediator: a.id === action.payload
                    }))
            };
        case "START_BRAINSTORM":
            return {
                ...state,
                phase: "brainstorm"
            };
        case "ADD_IDEA":
            {
                const trimmed = action.payload.trim();
                if (!trimmed) return state;
                const color = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$colors$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["getRandomStickyColor"])();
                const newIdea = {
                    id: crypto.randomUUID(),
                    content: trimmed,
                    isPreferred: false,
                    createdAt: Date.now(),
                    color: JSON.stringify(color)
                };
                return {
                    ...state,
                    ideas: [
                        ...state.ideas,
                        newIdea
                    ]
                };
            }
        case "TOGGLE_PREFERRED":
            return {
                ...state,
                ideas: state.ideas.map((i)=>i.id === action.payload ? {
                        ...i,
                        isPreferred: !i.isPreferred
                    } : i)
            };
        case "REMOVE_IDEA":
            return {
                ...state,
                ideas: state.ideas.filter((i)=>i.id !== action.payload)
            };
        case "END_BRAINSTORM":
            return {
                ...state,
                phase: "review"
            };
        case "DISCARD_IDEA":
            return {
                ...state,
                discardedIdeaIds: [
                    ...state.discardedIdeaIds,
                    action.payload
                ]
            };
        case "RESTORE_IDEA":
            return {
                ...state,
                discardedIdeaIds: state.discardedIdeaIds.filter((id)=>id !== action.payload)
            };
        case "COMPLETE_SESSION":
            return {
                ...state,
                phase: "complete"
            };
        case "RESET_SESSION":
            return {
                ...initialState
            };
        default:
            return state;
    }
}
function migrateState(saved) {
    if (saved.problemDescription && !saved.situationDescription) {
        saved.situationDescription = saved.problemDescription;
    }
    return {
        phase: saved.phase || initialState.phase,
        situationDescription: saved.situationDescription || initialState.situationDescription,
        relationshipDynamics: saved.relationshipDynamics || initialState.relationshipDynamics,
        interests: saved.interests || initialState.interests,
        attendees: saved.attendees || initialState.attendees,
        ideas: saved.ideas || initialState.ideas,
        discardedIdeaIds: saved.discardedIdeaIds || initialState.discardedIdeaIds
    };
}
const BrainstormContext = /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["createContext"])(null);
function BrainstormProvider({ children }) {
    const [state, dispatch] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useReducer"])(brainstormReducer, initialState, ()=>{
        const saved = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$storage$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["loadState"])();
        if (saved) {
            return migrateState(saved);
        }
        return initialState;
    });
    const saveTimerRef = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useRef"])(null);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useEffect"])(()=>{
        if (saveTimerRef.current) {
            clearTimeout(saveTimerRef.current);
        }
        saveTimerRef.current = setTimeout(()=>{
            (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$storage$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["saveState"])(state);
        }, 500);
        return ()=>{
            if (saveTimerRef.current) {
                clearTimeout(saveTimerRef.current);
            }
        };
    }, [
        state
    ]);
    const resetSession = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useCallback"])(()=>{
        dispatch({
            type: "RESET_SESSION"
        });
        (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$utils$2f$storage$2e$ts__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["clearState"])();
    }, []);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(BrainstormContext.Provider, {
        value: {
            state,
            dispatch,
            resetSession
        },
        children: children
    }, void 0, false, {
        fileName: "[project]/src/context/BrainstormContext.tsx",
        lineNumber: 187,
        columnNumber: 5
    }, this);
}
function useBrainstorm() {
    const ctx = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["useContext"])(BrainstormContext);
    if (!ctx) {
        throw new Error("useBrainstorm must be used within BrainstormProvider");
    }
    return ctx;
}
}),
"[externals]/next/dist/server/app-render/action-async-storage.external.js [external] (next/dist/server/app-render/action-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/action-async-storage.external.js", () => require("next/dist/server/app-render/action-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-unit-async-storage.external.js [external] (next/dist/server/app-render/work-unit-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-unit-async-storage.external.js", () => require("next/dist/server/app-render/work-unit-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-async-storage.external.js [external] (next/dist/server/app-render/work-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-async-storage.external.js", () => require("next/dist/server/app-render/work-async-storage.external.js"));

module.exports = mod;
}),
"[project]/src/components/AnimatePresenceWrapper.tsx [app-ssr] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "AnimatePresenceWrapper",
    ()=>AnimatePresenceWrapper
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$components$2f$AnimatePresence$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/framer-motion/dist/es/components/AnimatePresence/index.mjs [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [app-ssr] (ecmascript)");
"use client";
;
;
;
function AnimatePresenceWrapper({ children }) {
    const pathname = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["usePathname"])();
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$components$2f$AnimatePresence$2f$index$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["AnimatePresence"], {
        mode: "wait",
        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            children: children
        }, pathname, false, {
            fileName: "[project]/src/components/AnimatePresenceWrapper.tsx",
            lineNumber: 11,
            columnNumber: 7
        }, this)
    }, void 0, false, {
        fileName: "[project]/src/components/AnimatePresenceWrapper.tsx",
        lineNumber: 10,
        columnNumber: 5
    }, this);
}
}),
"[externals]/next/dist/server/app-render/after-task-async-storage.external.js [external] (next/dist/server/app-render/after-task-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/after-task-async-storage.external.js", () => require("next/dist/server/app-render/after-task-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/dynamic-access-async-storage.external.js [external] (next/dist/server/app-render/dynamic-access-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/dynamic-access-async-storage.external.js", () => require("next/dist/server/app-render/dynamic-access-async-storage.external.js"));

module.exports = mod;
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__0-3jfux._.js.map