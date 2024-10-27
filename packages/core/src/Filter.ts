export class StringFilterItem {

    public constructor(
        public readonly varName: string,
        public readonly operator: string,
        public readonly expected: boolean,
        private readonly _test: (v: string) => boolean,
    ) {}

    public static compile(singleExpr: string): StringFilterItem {

        const result = /^(\w+)([~*$^!=]{2})(.+)$/.exec(singleExpr);

        if (!result) {

            throw new SyntaxError(`Invalid filter syntax on item "${singleExpr}".`);
        }

        const varName = result[1];
        const op = result[2];
        const value = result[3].trim().toLowerCase();

        switch (op) {

            case '==':
                return new StringFilterItem(
                    varName,
                    op,
                    true,
                    (v) => v === value
                );
            case '!=':
                return new StringFilterItem(
                    varName,
                    op,
                    false,
                    (v) => v === value
                );
            case '*=':
                return new StringFilterItem(
                    varName,
                    op,
                    true,
                    (v) => v.includes(value)
                );
            case '*!':
                return new StringFilterItem(
                    varName,
                    op,
                    false,
                    (v) => v.includes(value)
                );
            case '^=':
                return new StringFilterItem(
                    varName,
                    op,
                    true,
                    (v) => v.startsWith(value)
                );
            case '^!':
                return new StringFilterItem(
                    varName,
                    op,
                    false,
                    (v) => v.startsWith(value)
                );
            case '$=':
                return new StringFilterItem(
                    varName,
                    op,
                    true,
                    (v) => v.endsWith(value)
                );
            case '$!':
                return new StringFilterItem(
                    varName,
                    op,
                    false,
                    (v) => v.endsWith(value)
                );
            case '~=':
                try {
                    const reg = new RegExp(value);
                    return new StringFilterItem(
                        varName,
                        op,
                        true,
                        (v) => reg.test(v)
                    );
                }
                catch {

                    throw new SyntaxError(`Invalid regular expression on item "${singleExpr}".`);
                }
            case '~!':
                try {
                    const reg = new RegExp(value);
                    return new StringFilterItem(
                        varName,
                        op,
                        false,
                        (v) => reg.test(v)
                    );
                }
                catch {

                    throw new SyntaxError(`Invalid regular expression on item "${singleExpr}".`);
                }
            default:
                throw new SyntaxError(`Invalid operator on item "${singleExpr}".`);
        }

    }

    public test(value: string): boolean {

        return this._test(value.toLowerCase()) === this.expected;
    }

    public testArray(values: string[]): boolean {

        if (this.expected && !values.length) {

            return false;
        }

        if (this.expected !== values.some(i => this._test(i.toLowerCase()))) {

            return false;
        }

        return true;
    }
}

export class StringFilter {

    public constructor(
        private readonly _items: StringFilterItem[],
    ) {}

    public static compile(filterRule: string): StringFilter {

        const items: StringFilterItem[] = [];

        for (const item of filterRule.split(/\s*&&\s*/)) {

            items.push(StringFilterItem.compile(item));
        }

        return new StringFilter(items);
    }

    public test(values: Record<string, string | string[]>): boolean {

        for (const item of this._items) {

            const v = values[item.varName];

            if (Array.isArray(v)) {

                if (!item.testArray(v)) {

                    return false;
                }
            }
            else if (!item.test(v ?? '')) {

                return false;
            }
        }

        return true;
    }
}

export class StringFilterGroup {

    public constructor(
        private readonly _filters: StringFilter[],
    ) {}

    public test(values: Record<string, string | string[]>): boolean {

        return this._filters.some(i => i.test(values));
    }

    public static build(filterRules: string[]): StringFilterGroup {

        if (!filterRules.length) {

            return new StringFilterGroup([
                new StringFilter([
                    new StringFilterItem('name', '==', true, () => true)
                ])
            ]);
        }

        return new StringFilterGroup(filterRules.map(i => StringFilter.compile(i)));
    }
}
