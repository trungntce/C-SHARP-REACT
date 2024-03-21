namespace WebApp;

using Microsoft.Extensions.Primitives;

using Framework;

static public class AppExtension
{
	static public Dictionary<string, object> ToDic(this IQueryCollection query, Func<string, string>? columnNameFunc = null)
	{
		if (columnNameFunc == null)
			columnNameFunc = x => x;

		var rtn = new Dictionary<string, object>();

		foreach (KeyValuePair<string, StringValues> kvp in query)
		{
			rtn.Add(columnNameFunc(kvp.Key), kvp.Value.ToString());
		}

		return rtn;
	}

    public static RangeEnumerator GetEnumerator(this Range range)
    {
        return new RangeEnumerator(range);
    }

    public struct RangeEnumerator
    {
        private int _current;
        private readonly int _end;

        public RangeEnumerator(Range range)
        {
            if (range.End.IsFromEnd)
                throw new NotSupportedException();

            _current = range.Start.Value - 1;
            _end = range.End.Value;
        }

        public int Current => _current;

        public bool MoveNext()
        {
            _current++;

            return _current <= _end;
        }
    }
}
