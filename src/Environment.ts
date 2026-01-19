export type Environment = "dev" | "tst" | "prd"

function resolve(): Environment {
    const node_env = process.env.NODE_ENV?.toLowerCase();

    switch (node_env) {
        case "dev":
        case "development":
            return "dev"

        case "tst":
        case "test":
        case "testing":
            return "tst";

        case "prd":
        case "prod":
        case "production":
            return "prd";
    
        default: return "dev"; // Safe default
    }
}

export const NODE_EVIRONMENT = resolve();

export const isDev = NODE_EVIRONMENT === "dev";
export const isTst = NODE_EVIRONMENT === "tst";
export const isPrd = NODE_EVIRONMENT === "prd";
