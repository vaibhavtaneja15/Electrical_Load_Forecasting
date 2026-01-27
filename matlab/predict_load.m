function y = predict_load(x)
    persistent net_loaded

    if isempty(net_loaded)
        S = load('net.mat','net');
        net_loaded = S.net;
    end

    y = net_loaded(x);
end
