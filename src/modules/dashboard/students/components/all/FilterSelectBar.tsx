import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import React from "react";
import { AllFilterType } from "../../types";
import { useTranslations } from "next-intl";

type AsConstArray = readonly string[];
interface FilterSelectBarProps<T extends AsConstArray> {
  dataList: T;
  valueSetter: (value: T[number]) => void;
  value: string;
  defaultValueName: AllFilterType;
  translateTag?: string;
  suffix?: string;
}

const FilterSelectBar = <T extends AsConstArray>({
  dataList,
  suffix,
  valueSetter,
  value,
  defaultValueName,
  translateTag,
}: FilterSelectBarProps<T>) => {
  const t = useTranslations(translateTag);

  return (
    <Select value={value} onValueChange={(v) => valueSetter(v as T[number])}>
      <SelectTrigger className="w-36 text-sm text-slate-200 border-2 border-emerald-700/50">
        <SelectValue defaultValue={value} />
      </SelectTrigger>
      <SelectContent>
        {[defaultValueName, ...dataList].map((course, i) => (
          <SelectItem key={i} value={course}>
            {translateTag ? t(course) : course + (i !== 0 ? " " + suffix : "")}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};

export default FilterSelectBar;
